// import dependecies
const yargs = require('yargs');// yargs helps to parse command line arguments easier.
const axios = require('axios').default;// axios is used to make http requests.
const dedent = require('dedent');// used dedent to strip indentation the userProfileOutput variable.

// used the argv property from yargs and assigned it to a variable.
const argv = yargs.argv;
const clientEmail = argv.clientEmail;

const URL = 'https://whmcstest.proxy.beeceptor.com';

/* used a if statement to make a http request only when user enters client email address,
the client details will output if email address is valid.
After the /client API is called, the second API will be called automatically by using the
userid from the /client API which will be inputed in the /invoice API endpoint.
The /invoice API will display the client details and invoice summary  */
if (clientEmail) {   
    axios
        .get(`${URL}/client/${clientEmail}`)
        .then((res) => {
            console.log(res.data);
    Promise
        .all([
        axios.get(`${URL}/client/${clientEmail}`),  
        axios.get(`${URL}/invoices/${res.data.userid}`)
    ])
    .then(axios.spread((userProfile, userInvoice) => {

    //const regex = `/^\s([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d\s)$/g`;
  
        // USER PROFILE SUMMARY
        const userProfileOutput = dedent`=========================================================
                                        ${userProfile.data.fullname} (${userProfile.data.email})
                                        ID: ${userProfile.data.id}
                                        Status: ${userProfile.data.status}
                                        Credit: ${userProfile.data.currency_code} ${userProfile.data.credit}
                                        Last Login:${userProfile.data.lastlogin.replace(/Date:|<br>/g, "")}`;

        console.log(userProfileOutput);

        // USER INVOICE SUMMARY
        const userInvoiceHeadingOutput = dedent`\nOrders
                                                # - InvoiceId - Status - Date - Due_Date - Total`;

        console.log(userInvoiceHeadingOutput);

        const invoiceArray = userInvoice.data.invoices.invoice;

        // used for loop to loop through the client invoices
        for (let i = 1; i < invoiceArray.length; i++) {
            const userInvoiceOutput = `${i}. ${invoiceArray[i].id} | ${invoiceArray[i].status} | ${invoiceArray[i].date} | ${invoiceArray[i].duedate} | ${invoiceArray[i].currencycode} ${invoiceArray[i].total}`
            console.log(userInvoiceOutput);  
        }
    }));
    })
    .catch(err => {
       if (err.response.status === 404) {
            console.log("User not found");
        }
        else {
            console.log('Error', err.response.status);
        }
    });
}