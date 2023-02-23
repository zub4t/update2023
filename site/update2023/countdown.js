document.addEventListener('DOMContentLoaded', () => {


    // Get the current date
    var currentDate = new Date();

    // Set the target date
    var targetDate = new Date("March 23, " + currentDate.getFullYear());

    // Check if the target date has already passed in the current year
    if (currentDate > targetDate) {
        // If it has, set the target date to the following year
        targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    // Calculate the difference between the current date and the target date in milliseconds
    var timeDifference = targetDate - currentDate;

    // Convert the time difference to days
    var daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    console.log("Days left until March 23rd: " + daysLeft);

    // Unix timestamp (in seconds) to count down to
    var daysFromNow = (new Date().getTime() / 1000) + (86400 * daysLeft) + 1;

    // Set up FlipDown
    var flipdown = new FlipDown(daysFromNow, { "theme": "light" })

    // Start the countdown
    .start()

    // Do something when the countdown ends
    .ifEnded(() => {
        console.log('The countdown has ended!');
    });



});