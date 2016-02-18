#{'
	<script>
		$(document).ready(function() {
			if ($("#openChat").length == 0) {
				$("div#headerButtons > div.buttons").append("<button id=openChat class=\\"openChat ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only blueButton\\" role=button aria-disabled=false><span class=ui-button-text>Open Chat</span></button>");
			}
			$("body").off("click.openChat").on("click.openChat",".openChat",function () {
				openChatWindow();
				chat.server.broadcastNotification(" opened chat window.");
			});
			$("body").off("click.closeChat").on("click.closeChat",".closeChat",function () {
				closeChatWindow();
				chat.server.broadcastNotification(" closed chat window.");
			});
			$("body").prepend("<div id=slideChat><div class=closeChat>X</div><div id=chatWindow><ul id=discussion></ul></div><input type=text placeholder=\\"ENTER YOUR MESSAGE HERE\\" id=message /></div>");
		});

		function openChatWindow () {
			$("div#slideChat").show();
			$("div#slideChat").animate({top: "0"}, 500);
		}

		function closeChatWindow() {
			$("div#slideChat").animate({top: "-500px"}, 500, function() {
				$("#slideChat").hide();
			});
		}
	</script>
'}