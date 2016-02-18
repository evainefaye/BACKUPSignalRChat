#{'
	<script>
		function getContext() {
			context = wf.getContext();
			return context;
		}

		function getSeparator(splitter) {
			separator =  "#{\'" + splitter + "\'}";
			return separator;
		}

		function resultsToJSON(fields, data) {
			result = data.result;
			if (data.result === null) {
				result = splitter;
			}
			resultArray = result.split(splitter);
			resultObj = new Object();
			var arrayLength = fields.length;
			for (var i = 0; i < arrayLength; i++) {
				value = resultArray[i].replace(/"/g,"\\\'");
				field = fields[i];
				resultObj[field] = value;
			}
			json = JSON.stringify(resultObj);
			return json;
		}

		function getDictionaryValues(fields) {
			expression = "";
			context = getContext();
			var arrayLength = fields.length;
			for (var i = 0; i < arrayLength; i++) {
				field = fields[i];
				expression = expression + "#{" + fields[i] + "}";
				if (i < arrayLength - 1) {
					expression = expression + separator;
				}
			}
			$.ajax({
				type: "POST",
				dataType: "json",
				async: false,
				url: "ExpressionEvaluator.do",
				success: function(data) {
					json = resultsToJSON(fields, data);
				},
				data : {
					expression : expression,
					context : context
				}
			});
		}

		splitter = "{sep}";
		separator = getSeparator(splitter);

		/* Function to request data from outside of SASHA */
		function gatherSashaData(sendTo,fields) {
			getDictionaryValues(fields);
			values = $.parseJSON(json);
			smpSessionId = values.smpSessionId;
			chat.server.pushSashaData(sendTo,smpSessionId,json);
		}

		/* Function showing an unrequested broadcast of data which can be called from inside SASHA */
		function broadcastSashaData(fields) {
			getDictionaryValues(fields);
			values = $.parseJSON(json);
			smpSessionId = values.smpSessionId;
			chat.server.pushSashaData(smpSessionId,json);
		}
	</script>
'}