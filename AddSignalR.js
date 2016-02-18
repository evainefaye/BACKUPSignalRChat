#{'
	<script>
		$(document).ready(function() {

			/* Update Stepname with each Ajax Request */
			$(document).ajaxComplete(function() {
				updateSashaMilestone();
			});

			/* Stop your connection if your are closing the window */
			window.onbeforeunload = function (e) {
				delete window.hubStart; $.connection.hub.stop();
			};

			/* Start the connection if you have not done so */
			if (typeof(window.hubStart) === "undefined") {
				$.getScript("http://ajax.aspnetcdn.com/ajax/signalr/jquery.signalr-2.2.0.min.js", function () {
					$.getScript("https://tsc-sna-0001.wayad.corp.wayport.net/signalr/hubs", function() {
						chat = $.connection.myHub;

						/* Define methods the server can call on the client */
						chat.client.debug = function (message) {
							console.log(message);
						};
						chat.client.broadcastMessage = function (name, message) {
							time = getLocalTime();
							name = time + "  " + name;
							var encodedName = $("<div />").text(name).html();
							var encodedMsg = $("<div />").text(message).html();
							$("#discussion").append("<li><strong>" + encodedName + "</strong>:&nbsp;&nbsp;" + encodedMsg + "</li>");
							$("div#chatWindow").scrollTop($("div#chatWindow")[0].scrollHeight - $("div#chatWindow")[0].clientHeight);
						};

						chat.client.selfNotify = function (name, message) {
							time = getLocalTime();
							name = time + "  ";
							var encodedName = $("<div />").text(name).html();
							var encodedMsg = $("<div />").text(message).html();
							$("#discussion").append("<li>" + encodedName + "You " + encodedMsg + "</li>");
							$("div#chatWindow").scrollTop($("div#chatWindow")[0].scrollHeight - $("div#chatWindow")[0].clientHeight);
						};

						chat.client.broadcastNotification = function (name, message) {
							time = getLocalTime();
							name = time + "  " + name;
							var encodedName = $("<div />").text(name).html();
							var encodedMsg = $("<div />").text(message).html();
							$("#discussion").append("<li>" + encodedName +  encodedMsg + "</li>");
							$("div#chatWindow").scrollTop($("div#chatWindow")[0].scrollHeight - $("div#chatWindow")[0].clientHeight);
						};

						chat.client.gatherSashaData = function (sendTo,fields) {
							gatherSashaData(sendTo,fields);
						};

						chat.client.saveDictionary = function(requester) {
							context=wf.getContext();
							agentID=$("div#agentID span").html();
							time=$.now();
							captureName=agentID+time;
							$.ajax({
								type: "POST",
								dataType: "json",
								url: "CaptureDictionary.do",
								data: {
									captureName: captureName,
									context: context
								}
							});

							chat.server.broadcastMessage("Data dictionary requested to be saved by " + requester + " saved as " + captureName);
						};

						chat.client.requestChat = function (requester,requesterConnectionId) {
							if ($("div#slideChat").is(":visible")) {
								return;
							}
							openChatWindow();
							if (!document.hasFocus()) {
								alert("Chat opened by " + requester);
							}
						};

						chat.client.declareSashaClient = function () {
							chat.server.registerSashaSession("'}#{userName}#{'","'}#{AgentName}#{'");
						};
						
						$.connection.hub.url = "https://tsc-sna-0001.wayad.corp.wayport.net/signalr";
						window.startHub();
					});
				});
			}
		});

		/* Starts Hub if not started */
		window.startHub = function () {
			if (typeof(window.hubStart) === "undefined") {
				window.hubStart = $.connection.hub.start().done(function () {
					chat.server.registerSashaSession("'}#{userName}#{'","'}#{AgentName}#{'");
					CRToSend();
					updateSashaMilestone();
				});
			}
		};

		/* Gets the local time */
		getLocalTime = function() {
			var d = new Date();
			var time = ("00" + d.getHours()).substr(-2) + ":" + ("00" + d.getMinutes()).substr(-2) + ":" + ("00" + d.getSeconds()).substr(-2); var time = "[ " + time + " ]";
			return time;
		};

		/* Function to setup pressing return or clicking send button to send a message to the chat */
		CRToSend = function() {
			$("#message").off("keyup.CRToSend").on("keyup.CRToSend",function(event) {
				if (event.keyCode == 13) {
					displayName = "'}#{AgentName}#{'";
					if ($("#message").val().trim() != "") {
						chat.server.broadcastMessage($("#message").val());
						$("#message").val("").focus();
					}
				}
			});
		};

		/* Add the Sasha Step Name on each load */
		updateSashaMilestone = function () {
			stepInfo = wf.getStepInfo();
			stepName=stepInfo.stepName.toUpperCase();
			chat.server.updateSashaMilestone(stepName);
		};
	</script>
'}