$(function () {
    var $sendButton = $(".contact-form .submit")
    var $inputName = $("input#name")
    var $inputContact = $("input#contact")
    var $inputMessage = $("input#message")
    var $sendStatus = $("#send-status");

    var sendCallback = function () {
        $sendStatus.text("✔ Відправлено.")
        $sendStatus.fadeIn()
        $sendButton.removeClass("submit-loading")
        $sendStatus.delay(3000).fadeOut()
    }

    $sendButton.click(function () {
        var data = {
            name: $inputName.text(),
            contact: $inputContact.text(),
            message: $inputMessage.text()
        }

        console.log("Sending data")
        console.log(data)

        sendMail(data, sendCallback)

        $(this).addClass("submit-loading")

        return false
    })
})