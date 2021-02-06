// import dependecies
const yargs = require('yargs');// yargs helps to parse command line arguments easier.
const axios = require('axios').default;// axios is used to make http requests.


// used the argv property from yargs and assigned it to a variable.
let argv = yargs.argv;
let email = argv.email;
let id = argv.id;

/* used an else if statement to make a http request only when user enters the valid 
client email address, the json script will be displayed 
or when user enters a valid client id the formatted output will be displayed. 
If both email and id is invalid an error message will be displayed.*/
if(email === "vfamryzfqutjwhlpme@niwghx.com") {
    axios.get(`https://whmcstest.proxy.beeceptor.com/client/${email}`)
    .then((res) => {
        console.log(res.data);
    })
    .catch(err => {
        console.log(err)
    })
} else if (id === 126079) {
    axios.all([
        axios.get(`https://whmcstest.proxy.beeceptor.com/invoices/${id}`),
        axios.get(`https://whmcstest.proxy.beeceptor.com/client/vfamryzfqutjwhlpme@niwghx.com`)
    ])
    .then(res => {
        console.log("=========================================================="
                    +'\n'+res[1].data.fullname + " ("+ res[1].data.email +")"
                    +'\n'+"ID: " + res[1].data.id
                    +'\n'+"Status: " + res[1].data.status
                    +'\n'+"Credit: " + res[1].data.currency_code + " " + res[1].data.credit
                    +'\n'+"Last Login:" + res[1].data.lastlogin.replace(/Date:|<br>/g, ""));

        console.log('\n'+"Orders"
                    +'\n'+"# - InvoiceId - Status - Date - Due_Date - Total"
                    +'\n'+"1. "  + res[0].data.invoices.invoice[0].id 
                     + " | " + res[0].data.invoices.invoice[0].status
                     + " | " + res[0].data.invoices.invoice[0].date
                     + " | " + res[0].data.invoices.invoice[0].duedate
                     + " | " + res[0].data.invoices.invoice[0].currencycode + " " + res[0].data.invoices.invoice[0].total);
    
    });
} else {
    console.log("User not found");
}