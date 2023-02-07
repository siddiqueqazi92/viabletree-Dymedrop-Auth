// const moment = require('moment')

// const time = moment.utc().format('YYYY-MM-DD HH:mm:ss')

// console.log(time);

// var a = "      "
// if (!a || a.length < 6) {
//     return console.log('true')
// }
// console.log('false')

const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};

// let password1 = 'qwerty' // 6 char long
// let password2 = ' q we ' // 6 char long
// let password3 = '      ' // 6 char long

// let p1length = password1.replace(/\s/g, "").length
// let p2length = password2.replace(/\s/g, "").length
// let p3length = password3.replace(/\s/g, "").length
// // values.title.replace(/\s/g, "").length

// console.log(p1length, p2length, p3length)

// console.log(password2.length)

let password = "   f     "
if (password.replace(/\s/g, "").length > 0 && password.length > 5) {
    console.log('valid password');
}
else {
    console.log('invalid password');
}
console.log('Password length: ', password.length);
console.log('No. of spaces: ', password.length - password.replace(/\s/g, "").length);
console.log('No. of non-space characters: ', password.replace(/\s/g, "").length);
