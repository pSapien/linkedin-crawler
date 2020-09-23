const inquirer = require('inquirer');

const QUESTIONS = [
  {
    type: 'input',
    name: 'email',
    message: 'Enter your LinkedIn email',
  },
  {
    type: 'password',
    name: 'password',
    message: 'Enter your LinkedIn password',
  },
]

async function askCredentials() {
  return inquirer.prompt(QUESTIONS);
}

module.exports = askCredentials;