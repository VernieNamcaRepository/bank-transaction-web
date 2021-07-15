import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert } from '@material-ui/lab';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Zoom } from 'react-preloaders';
import axios from '../utils/api';

function Copyright() {
  return (
    <Typography variant="body1" color="textSecondary" align="center">
      {`Copyright © ${new Date().getFullYear()} `}
      <Link color="primary" href="https://www.lorem.ipsum.com/">
         <strong>{`The Lorem IpSum Co.`}</strong>
      </Link>
      All Rights Reserved.
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
   root: {},
   paper: {
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      marginTop: theme.spacing(20),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
   },
   alertContainer: {
    width: '100%',
    '& > * + *': {
      marginTop: 10,
    }
   },
   form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
   },
   disclaimer: {
      fontStyle: 'italic',
      fontSize: 14
   }
}));

export default function Transaction() {
   const classes = useStyles();

   const transactionTypeData = [
      {
         id: 1,
         description: 'Withdrawal'
      },
      {
         id: 2,
         description: 'Deposit'
      }
   ]

   const initialValues = {
      accountNumber: '',
      accountName: '',
      currentBalance: 0,
      transactionType: 1,
      amount: 0,
      transactionDate: new Date().toLocaleString()
   };

   const [values, setValues] = useState({ ...initialValues });
   const [loading, setLoading] = useState(false);
   const [openAlert, setOpenAlert] = useState(false);
   const [formState, setFormState] = useState({
      alertSeverity: "error",
      message: 'There is a problem on your transaction. Please try again later!'
    });

useEffect(() => {
   let mounted = true;

   axios.get(`transaction/getbalance?accountNumber=000-1-2345-6789-0`).then(response => {
      if (mounted) {
         setValues(response.data.account);
      }
    });

    return () => {
      mounted = false;
    };
}, []);

const handleChange = (event, field, value) => {
   event.persist && event.persist();

   if (value === 'transactionType') {
      var transactionType = transactionTypeData.find(x => x.description === field);

      console.log(transactionType);

      setFormState(formState => ({ 
         ...formState, 
         values: {...formState.values, transactionType: transactionType.id }
      }));
   }

   setValues(values => ({
     ...values,
     [field]: value
   }));
 };

const handleSubmit = event => {
   event.preventDefault();

   if (formState.values.transactionType === 1) {
      axios.post(`transaction/withdraw`, { 
         transaction: {
            accountNumber: values.accountNumber, 
            amount: parseFloat(values.amount)
      }}).then(response => {
         setFormState(formState => ({
            ...formState,
            alertSeverity: "success",
            message: `Withdrawal transaction amounting ${values.amount} has been successful. The page will refresh within 3 seconds.`
         })); 

         setOpenAlert(true);

         setLoading(false);

         setTimeout(function(){ window.location.reload() }, 3000); 
      });
   } else {
      axios.post(`transaction/deposit`, { 
         transaction: {
            accountNumber: values.accountNumber, 
            amount: parseFloat(values.amount)
      }}).then(response => {
         setFormState(formState => ({
            ...formState,
            alertSeverity: "success",
            message: `You have been successfully deposited amount of ${values.amount} to your account. The page will refresh within 3 seconds.`
         })); 

         setOpenAlert(true);

         setLoading(false);

         setTimeout(function(){ window.location.reload() }, 3000); 
      });
   }
}

document.body.style.overflow = 'scroll';
document.body.style.position = 'inherit';

return (
    <Container className={classes.root} component="main" maxWidth="md">
      <CssBaseline />
      <AppBar color="inherit">
         <Toolbar>
            <img 
               alt="The Lorem IpSum Co." 
               height="100px"
               src="LoremIpsumLogo.png"
            />
         </Toolbar>
      </AppBar>
      <div className={classes.paper}>
         {loading && <Zoom background="rgba(192,192,192,0.3)" customLoading={loading} color="#000099"/>}
         <Typography component="h1" variant="h4">The Lorem IpSum Co.</Typography>
         <Typography variant="body2" gutterBottom>
            Your kind of people… your kind of bank.
         </Typography>

         <div className={classes.alertContainer}>
         {
            openAlert && (
               <Alert variant="filled" severity={formState.alertSeverity}> { formState.message }</Alert>
            )
         }
        </div>
         
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
               <Typography variant="body2" className={classes.disclaimer}  gutterBottom>
                  All fields with asterisk (*) are mandatory.
               </Typography>
            </Grid>

            <Grid item xs={6}>
              <TextField
                variant="outlined"
                autoComplete="off"
                required
                fullWidth
                id="accountNumber"
                label="Account Number"
                name="accountNumber"
                value={values.accountNumber || ''}
                autoFocus
                onChange={event => handleChange(event, 'accountNumber', event.target.value)}
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="off"
                id="accountName"
                label="Account Name"
                name="accountName"
                value={values.accountName || ''}
                onChange={event => handleChange(event, 'accountName', event.target.value)}
                variant="outlined"
                required
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="off"
                id="currentBalance"
                label="Current Balance"
                name="currentBalance"
                value={values.currentBalance || ''}
                onChange={event => handleChange(event, 'currentBalance', event.target.value)}
                variant="outlined"
                required
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                id="transactionType"
                required
                fullWidth
                options={transactionTypeData.map(option => option.description)}
                onChange={(event, value) => handleChange(event, value, 'transactionType')}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} label="Transaction Type" required variant="outlined" />}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoFocus
                type="number"
                autoComplete="off"
                id="amount"
                label="Amount"
                name="amount"
                value={values.amount || ''}
                onChange={event => handleChange(event, 'amount', event.target.value)}
                variant="outlined"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                autoComplete="off"
                id="transactionDate"
                label="Transaction Date"
                name="transactionDate"
                value={initialValues.transactionDate || ''}
                onChange={event => handleChange(event, 'transactionDate', event.target.value)}
                variant="outlined"
                required
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Proceed Transaction
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}