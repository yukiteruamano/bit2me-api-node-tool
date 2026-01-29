const { getAccountDetails } = require('./accountDetails.js');

async function debug() {
    try {
        const data = await getAccountDetails();
        console.log("Keys:", Object.keys(data));
        console.log("Profile:", data.profile);
        console.log("Person:", data.person);
        console.log("Money:", data.money); // Check if this exists
        console.log("Portfolio:", data.portfolio); // Check if this exists
        console.log("Name:", data.name);
        console.log("Surname:", data.surname);
        console.log("Phone:", data.phone);
    } catch (e) {
        console.error(e);
    }
}

debug();
