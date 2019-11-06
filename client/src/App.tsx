import * as React from 'react';
import { fetchCalculation } from './actions/calculate';
import { strings, labels, placeholders } from './infrastructure/constants';
import { CalculationState, CalculationProps, CalculationResult, Boundary } from './interface/index';
import { IconButton, TextField, Button, Snackbar, Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, InputAdornment } from '@material-ui/core';
import { CloudUpload, FunctionsOutlined, Redo } from '@material-ui/icons';
import './App.css';

const initialState: CalculationState = {
  amountFinanced: '',
  numberOfMonthlyPayments: '',
  monthlyPaymentAmount: '',
  monthlyString: strings.monthlyString,
  termString: strings.termString,
  amountFinancedString: strings.amountFinancedString,
  termLabel: labels.termLabel.default,
  monthlyAmountLabel: labels.monthlyAmountLabel,
  amountFinancedLabel: labels.amountFinancedLabel.default,
  termValueHasErrors: false,
  amountFinancedHasErrors: false,
  validCalculation: false,
  isModalOpen: false,
  error: false,
  errorMessage: '',
  applicationLocked: false,
  snackBar: {
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  },
  boundaries: {
    monthlyPayments: {
      bottom: 6,
      top: 48
    },
    amountFinanced: {
      bottom: 10000,
      top: 100000
    }
  }
}

class App extends React.Component<CalculationProps, CalculationState> {
  constructor(props: CalculationProps) {
    super(props);
    this.state = initialState;

    this.calculate = this.calculate.bind(this);
    this.updateInputFieldValue = this.updateInputFieldValue.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.submitApplication = this.submitApplication.bind(this);
  }

   calculate = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    const calculationElementId: string = event.currentTarget.id;
    let resultAmount: CalculationResult;
    const calculationContext: string = calculationElementId === this.state.monthlyString ? strings.monthlyString : strings.amountFinancedString;
    const stateVariableToAlter: string = calculationContext === this.state.monthlyString ? strings.amountFinancedString : strings.monthlyString;

    resultAmount = await fetchCalculation(this.state.numberOfMonthlyPayments, this.state.amountFinanced, this.state.monthlyPaymentAmount, calculationContext);
    
    this.setState<never>({
      [stateVariableToAlter]: resultAmount.result,
      error: resultAmount.error,
      errorMessage: resultAmount.errorMessage,
      amountFinancedHasErrors: resultAmount.error,
      validCalculation: resultAmount.validCalculation,
      amountFinancedLabel: resultAmount.error && calculationContext === strings.monthlyString ? labels.amountFinancedLabel.error : labels.amountFinancedLabel.default,
      snackBar: {
        open: resultAmount.error ? true : false,
      }
    })
   }

  submitApplication = (): void => {
    this.setState({ isModalOpen: true });
  }

  resetApplication = (): void => {
    this.setState(initialState);
  }

  onlyAllowNumbers = (value: string): string => {
    return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
  }

  updateInputFieldValue = async (event: {}): Promise<void> => {
    const e = event as React.ChangeEvent<HTMLInputElement>;
    e.persist();
    const { value, name } = e.target;
    await this.setState<never>({
      [name]: this.onlyAllowNumbers(value),
    })
    this.valiedateInput(name);
  }

  handleSnackBarClose = (): void => {
    this.setState({
      snackBar: {
        open: false
      }
    })
  }
  
  handleModalClose = (): void => {
    this.setState({ isModalOpen: false, applicationLocked: true })
  }

  valiedateInput = (field: string): void => {
    const validationContext: string = field === this.state.termString ? this.state.termString : this.state.amountFinancedString;
    const stateVariablesToAlter = {
      valueHasErrors: validationContext === this.state.termString ? 'termValueHasErrors' : 'amountFinancedHasErrors',
      labelString: validationContext === this.state.termString ? 'termLabel' : 'amountFinancedLabel',
      labelValue: validationContext === this.state.termString ? labels.termLabel : labels.amountFinancedLabel
    }

    if(this.isInputValueInvalid(validationContext)) {
      this.setState<never>({ [stateVariablesToAlter.valueHasErrors]: true, [stateVariablesToAlter.labelString]: stateVariablesToAlter.labelValue.error })
    } else {
      this.setState<never>({ [stateVariablesToAlter.valueHasErrors]: false, [stateVariablesToAlter.labelString]: stateVariablesToAlter.labelValue.default })
    }
  }
  
  isInputValueInvalid = (inputValueToValidate: string): boolean => {
    
    const stateVariableToValidate = {
      fieldToValidate: inputValueToValidate === this.state.termString ? this.state.numberOfMonthlyPayments : this.state.amountFinanced,
      fieldBoundary: inputValueToValidate === this.state.termString ? this.state.boundaries.monthlyPayments : this.state.boundaries.amountFinanced
    }
    
    return ((stateVariableToValidate.fieldToValidate < stateVariableToValidate.fieldBoundary.bottom 
                  && stateVariableToValidate.fieldToValidate !== '') 
                  || (stateVariableToValidate.fieldToValidate > stateVariableToValidate.fieldBoundary.top 
                  && stateVariableToValidate.fieldToValidate !== ''))
  }

  shouldInteractionBeDisabled = (value: string): boolean => {
    let amount: number;
    let boundary: Boundary;

    if(value === this.state.monthlyString) {
      amount = this.state.monthlyPaymentAmount;
      boundary = {
        bottom: 0,
        top: 10000
      }
    } else {
      amount = this.state.amountFinanced;
      boundary = {
        bottom: this.state.boundaries.amountFinanced.bottom,
        top: this.state.boundaries.amountFinanced.top
      }
    }
    return amount && this.state.numberOfMonthlyPayments
                  && amount > boundary.bottom
                  && amount < boundary.top
                  && this.state.numberOfMonthlyPayments >= this.state.boundaries.monthlyPayments.bottom 
                  && this.state.numberOfMonthlyPayments <= this.state.boundaries.monthlyPayments.top 
                  && !this.state.applicationLocked;
  }

  render() {
    return(
      <div className="container">
        <div className={`input-container ${!this.state.applicationLocked ? 'hidden' : ''} new-app`}>
          <h3>
            {strings.applicationSubmittedString}
          </h3>
          <p>
            {strings.newApplicationString}
          </p>
        </div>
        <div className="input-container heading"><h2>{strings.heading}</h2></div>
        <div className="input-container">
          <TextField 
            label={this.state.termLabel} 
            placeholder={placeholders.term} 
            fullWidth variant="outlined" 
            name={this.state.termString}
            value={this.state.numberOfMonthlyPayments} 
            onChange={this.updateInputFieldValue}
            disabled={this.state.applicationLocked}
            inputProps={{
              maxLength:2,
            }}
            error={this.state.termValueHasErrors}
          />
        </div>
        <div className="input-container">
          <TextField 
            label={this.state.amountFinancedLabel} 
            placeholder={placeholders.amountFinanced}
            fullWidth variant="outlined"
            name={this.state.amountFinancedString}
            value={this.state.amountFinanced} 
            onChange={this.updateInputFieldValue}
            disabled={this.state.applicationLocked}
            inputProps={{
              maxLength:6,
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            error={this.state.amountFinancedHasErrors}
          />
        <IconButton 
          id={this.state.monthlyString} 
          aria-label="calculate"
          disabled={this.shouldInteractionBeDisabled(this.state.monthlyString) ? false : true}
          onClick={this.calculate}>
          <FunctionsOutlined />
        </IconButton>
        </div>
        <div className="input-container">
          <TextField 
            label={this.state.monthlyAmountLabel} 
            fullWidth 
            variant="outlined" 
            name={this.state.monthlyString}
            value={this.state.monthlyPaymentAmount} 
            onChange={this.updateInputFieldValue}
            disabled={this.state.applicationLocked}
            inputProps={{
              maxLength:4,
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
          />
        <IconButton   
          id={this.state.amountFinancedString} 
          aria-label="calculate"
          disabled={this.shouldInteractionBeDisabled(this.state.amountFinancedString) ? false : true}
          onClick={this.calculate}>
          <FunctionsOutlined />
        </IconButton>
        </div>
        <div className="input-container">
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<CloudUpload />} 
            fullWidth
            disabled={!this.state.validCalculation || this.state.applicationLocked}
            onClick={this.submitApplication}>
              {strings.submitApplication}
            </Button>
        </div>
        <div className={`input-container ${!this.state.applicationLocked ? 'hidden' : ''}`}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Redo />} 
            fullWidth
            disabled={!this.state.applicationLocked}
            onClick={this.resetApplication}>
            {strings.newApplication}
            </Button>
        </div>
        <Snackbar
          key={`${this.state.snackBar.vertical},${this.state.snackBar.horizontal}`}
          open={this.state.snackBar.open}
          onClose={this.handleSnackBarClose}
          message={<span id="message-id">{this.state.errorMessage}</span>}
        />
        <Dialog
          open={this.state.isModalOpen}
          onClose={this.handleModalClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">{strings.submitApplication}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              {strings.confirmSubmitApplication}
              <span className="application-text">{this.state.amountFinancedLabel}: <strong>€{this.state.amountFinanced}</strong></span>
              <span className="application-text">{this.state.termLabel}: <strong>{this.state.numberOfMonthlyPayments}</strong></span>
              <span className="application-text">{this.state.monthlyAmountLabel}: <strong>€{this.state.monthlyPaymentAmount}</strong></span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleModalClose} color="primary" autoFocus>
            {labels.confirmSubmit}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    );
  }
}

export default App;