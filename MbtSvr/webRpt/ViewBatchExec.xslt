<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<!--  WEBRPT_Batch\ Exec\ List=BatchList.xslt;Y;@CURSVR@/MbtSvr/app\=websvc&action\=stat&components\=BatchList -->

<xsl:template match="BatchExec">
<html>
<head>
	<link type="text/css" href="css/webRpt.css" rel="stylesheet" />
	<script src="packages/jquery-1.8.3.min.js"></script>

	<style>
	
		#summary {
			background-color: #EEEEEE;
		}
		
		#listHeader {
			font-style: underline;
			font-weight: bold;
			width: 100%;
			margin-top: 3px;
			padding-top: 8px;
			padding-left: 5px;
			padding-bottom: 2px;
			background-color: #EEEEEE;
		}
		
	</style>

	<script>
		$(document).ready(function() {
			$("#curDateTime").text((new Date()).toString());
		});
	</script>
	<style>
		li {
			padding-top: 2px;
		}
	</style>
	
</head>
<body>
	<div class="reportHeader">
	  	<span><img class="logo" src="img/TO.png"/> Batch Execution: <xsl:value-of select="@desc"/></span>
	  	<span id="curDateTime" style="float:right; top: 15px; position:relative;font-size:xx-small;"></span>
	</div>

  	<table id="summary" border="1" cellspacing="0" cellpadding="2" width="100%">
	  	<tbody>
	  		<tr>
	  			<td colspan="4">
				  	<div style="padding-top: 8px; padding-bottom: 5px;">
				  		Back to  <a href="/MbtSvr/app=webrpt&amp;name=Batch Exec List">Batch List</a>
				  	</div>
			  	</td>
			</tr>
	  		<tr>
	  			<td class="label">Start Date/Time</td><td><xsl:value-of select="@startTS"/></td>
	  			<td class="label">End Date/Time</td><td><xsl:value-of select="@endTS"/></td>
	  		</tr>
	  		<tr>
	  			<td class="label">Submitted By</td><td><xsl:value-of select="@submitEmail"/></td>
	  			<td class="label">From Server</td><td><xsl:value-of select="@submitHost"/>:<xsl:value-of select="@submitPort"/></td>
	  		</tr>
	  	</tbody>
	</table>
	
	<div id="listHeader">Model Executions</div>
	<ol>
  		<xsl:for-each select="/WebSvcStats/BatchExec/MbtStat">
  		<li><a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=View Exec Stats&amp;MODEL=<xsl:value-of select="@model"/>&amp;EXECID=<xsl:value-of select="@execID"/></xsl:attribute>
 			<xsl:if test="string-length(normalize-space(@batchGroup))>0">
  			<xsl:value-of select="@batchGroup" />:
  			</xsl:if>
 			<xsl:value-of select="@model"/> (execID: <xsl:value-of select="@execID"/>)</a></li>
  		</xsl:for-each>
	</ol>
  </body>
  </html>
</xsl:template>


</xsl:stylesheet>
