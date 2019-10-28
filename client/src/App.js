import React, { Component } from 'react';
import { calculateAmountFinanced, calculateMonthlyPaymentAmount } from './actions/calculate';
import { strings, labels, placeholders } from './infrastructure/constants';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import FunctionsOutlinedIcon from '@material-ui/icons/FunctionsOutlined';
import RedoIcon from '@material-ui/icons/Redo';
import Snackbar from '@material-ui/core/Snackbar';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './App.css';

const initialState = {
  amountFinanced: '',
  numberOfMonthlyPayments: '',
  monthlyPaymentAmount: '',
  monthlyString: strings.monthlyString,
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
    variant: '',
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;

    this.calculate = this.calculate.bind(this);
    this.updateNumberOfMonthlyPayments = this.updateNumberOfMonthlyPayments.bind(this);
    this.updateAmountFinanced = this.updateAmountFinanced.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.submitApplication = this.submitApplication.bind(this);
  }

   calculate = async (event) => {
    const calculationId = event.target.id;
    let resultAmount;
      if(calculationId === this.state.monthlyString) {
        resultAmount = await calculateAmountFinanced(this.state.numberOfMonthlyPayments, this.state.monthlyPaymentAmount);
        this.setState({
          amountFinanced: resultAmount.result,
          error: resultAmount.error,
          errorMessage: resultAmount.errorMessage,
          amountFinancedHasErrors: resultAmount.error,
          validCalculation: resultAmount.validCalculation,
          amountFinancedLabel: resultAmount.error ? labels.amountFinancedLabel.error : labels.amountFinancedLabel.default,
          snackBar: {
            open: resultAmount.error ? true : false,
            variant: 'error'
          }
        })
      } else {
        resultAmount = await calculateMonthlyPaymentAmount(this.state.numberOfMonthlyPayments, this.state.amountFinanced);
        this.setState({
          monthlyPaymentAmount: resultAmount.result,
          error: resultAmount.error,
          errorMessage: resultAmount.errorMessage,
          amountFinancedHasErrors: resultAmount.error,
          validCalculation: resultAmount.validCalculation,
          snackBar: {
            open: resultAmount.error ? true : false,
            variant: 'error'
          }
        })
      }
   }

  submitApplication = () => {
    this.setState({ isModalOpen: true });
  }

  resetApplication = () => {
    this.setState(initialState);
  }

  updateNumberOfMonthlyPayments = async (event) => {
    event.preventDefault(); 
    await this.setState({
      numberOfMonthlyPayments: event.target.value.replace(' ', ''),
    })
    await this.validatedInput(this.state.monthlyString);
  }

  updateAmountFinanced = async (event) => {
    event.preventDefault();
    await this.setState({
      amountFinanced: event.target.value.replace(' ', ''),
    })
    await this.validatedInput(this.state.amountFinancedString);
  }

  updateMonthlyPaymentAmount = async (event) => {
    event.preventDefault();
    await this.setState({
      monthlyPaymentAmount: event.target.value.replace(' ', ''),
    })
  }

  handleSnackBarClose = () => {
    this.setState({
      snackBar: {
        open: false
      }
    })
  }
  
  handleModalClose = () => {
    this.setState({ isModalOpen: false, applicationLocked: true })
  }

  validatedInput = (field) => {
    if (field === this.state.monthlyString) {
      if (this.isTermValueInvalid()) {
        this.setState({ termValueHasErrors: true, termLabel: labels.termLabel.error })
      } else {
        this.setState({ termValueHasErrors: false, termLabel: labels.termLabel.default })
      }
    } else {
      if (this.isAmountFinancedInvalid()) {
        this.setState({ amountFinancedHasErrors: true, amountFinancedLabel: labels.amountFinancedLabel.error })
      } else {
        this.setState({ amountFinancedHasErrors: false, amountFinancedLabel: labels.amountFinancedLabel.default })    
      }
    }
  }
  
  isTermValueInvalid = () => {
    return ((this.state.numberOfMonthlyPayments < this.state.boundaries.monthlyPayments.bottom 
                  && this.state.numberOfMonthlyPayments !== '') 
                  || (this.state.numberOfMonthlyPayments > this.state.boundaries.monthlyPayments.top 
                  && this.state.numberOfMonthlyPayments !== ''))
  }

  isAmountFinancedInvalid = () => {
    return ((this.state.amountFinanced <= this.state.boundaries.amountFinanced.bottom 
                  && this.state.amountFinanced !== '') 
                  || (this.state.amountFinanced >= this.state.boundaries.amountFinanced.top 
                  && this.state.amountFinanced !== ''))
  }

  shouldInteractionBeDisabled = (value) => {
    let amount;
    let boundary;

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
                  && this.state.numberOfMonthlyPayments > this.state.boundaries.monthlyPayments.bottom 
                  && this.state.numberOfMonthlyPayments < this.state.boundaries.monthlyPayments.top 
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
            value={this.state.numberOfMonthlyPayments} 
            onChange={this.updateNumberOfMonthlyPayments}
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
            value={this.state.amountFinanced} 
            onChange={this.updateAmountFinanced}
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
          <FunctionsOutlinedIcon />
        </IconButton>
        </div>
        <div className="input-container">
          <TextField 
            label={this.state.monthlyAmountLabel} 
            fullWidth 
            variant="outlined" 
            value={this.state.monthlyPaymentAmount} 
            onChange={this.updateMonthlyPaymentAmount}
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
          <FunctionsOutlinedIcon />
        </IconButton>
        </div>
        <div className="input-container">
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<CloudUploadIcon />} 
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
            startIcon={<RedoIcon />} 
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
          variant="error"
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