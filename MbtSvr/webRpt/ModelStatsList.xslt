<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!--  WEBRPT_Model\ Stats\ List=ModelStatsList.xslt;Y;@CURSVR@/MbtSvr/app\=websvc&action\=stat&components\=ModelStatList&modelName\=@MODEL@ -->
<xsl:variable name="modelName" select="/WebSvcStats/ModelStatList/@model"/>
<xsl:template match="/WebSvcStats/ModelStatList">
<html>
<head>
	<link type="text/css" href="css/webRpt.css" rel="stylesheet" />
	<script src="packages/jquery-1.8.3.min.js"></script>
	<style>
		table {
			margin-top: 0px;
		}
		
		thead {
			background-color: #EEEEEE;
		}
	</style>
	<script>
		$(document).ready(function() {
			$("#curDateTime").text((new Date()).toString());
		});

		function init() {
			document.getElementById("curDateTime").innerText = "new Date()";
		}
		
	</script>
</head>
<body onload="init();">
	<div class="reportHeader">
	  	<span><img class="logo" src="img/TO.png"/> Execution List for Model: <a title="Click to goto Model Review"><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=Model Review&amp;MODEL=<xsl:value-of select="@model" /></xsl:attribute><xsl:value-of select="@model" /></a></span>
	  	<span id="curDateTime" style="float:right; top: 15px; position:relative;font-size:xx-small;"></span>
	</div>
  	<table width="100%">
	  	<thead>
	  		<tr>
	  			<th width="2%">ExecID</th><th>Stat Description</th><th width="20%">Start Date/Time</th><th width="5%">Batch Exec</th>
	  		</tr>
	  	</thead>
	  	<tbody>
	  		<xsl:for-each select="ExecStat">
	  		<tr>
	  			<td><a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=View Exec Stats&amp;MODEL=<xsl:value-of select="$modelName"/>&amp;EXECID=<xsl:value-of select="@execID"/></xsl:attribute><xsl:value-of select="@execID"/></a>
				</td>
	  			<td><xsl:value-of select="@statDesc" /></td>
	  			<td align="center"><xsl:value-of select="@startTime" /></td>
				<td align="center">
					<xsl:if test="@batchID > 0">
						<a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=View Batch Exec&amp;BATCHID=<xsl:value-of select="@batchID"/></xsl:attribute><xsl:value-of select="@batchID"/></a>
					</xsl:if>
				</td>
	  		</tr>
	  		</xsl:for-each>
	  	</tbody>
	</table>
  </body>
  </html>
</xsl:template>


</xsl:stylesheet>
