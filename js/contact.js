$(function () {
    var $sendButton = $(".contact-form .submit")
    var $inputName = $("#name")
    var $inputContact = $("#contact")
    var $inputMessage = $("#message")
    var $sendStatus = $("#send-status");

    var sendCallback = function (data) {
        $sendStatus.text("✔ Відправлено")
        $sendStatus.fadeIn()
        $sendButton.removeClass("submit-loading")
        $sendStatus.delay(3000).fadeOut()
        $sendButton.find("span").show()

        console.log("Success. Return:")
        console.log(data)
    };

    $sendButton.click(function () {
        var data = {
            name: $inputName.val(),
            contact: $inputContact.val(),
            message: $inputMessage.val()
        }

        console.log("Sending data")
        console.log(data);

        sendMail(data, sendCallback)

        $(this).find("span").hide()
        $(this).addClass("submit-loading")

        return false
    })
})