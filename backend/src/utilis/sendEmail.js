async function sendEmail(email) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`email send to ${email}`);
            resolve()
        }, 1000);
    });
}

export { sendEmail };