#{'
	<script>
		$(document).ready(function() {
			stepInfo = wf.getStepInfo();
			stepName = stepInfo.stepName;
			try {getDictionaryValues(["wf.lastAgentActivityTime"]);
				values = $.parseJSON(json);
				lastAgentActivityTime = values["wf.lastAgentActivityTime"];
				chat.server.updateMonitor(stepName, lastAgentActivityTime);
			}
			catch(err) {
			}
		});
	</script>
'}