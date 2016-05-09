<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  version="2.0"
  xmlns:xs="http://www.w3.org/2001/XMLSchema">
<!--  WEBRPT_Batch\ Exec\ List=BatchList.xslt;Y;@CURSVR@/MbtSvr/app\=websvc&action\=stat&components\=BatchList -->
<xsl:template match="/WebSvcStats/BatchList">
<html>
<head>
	<link type="text/css" href="css/webRpt.css" rel="stylesheet" />
	<script src="packages/jquery-1.8.3.min.js"></script>
	
	<style>
		thead {
			background-color: #EEEEEE;
		}
	</style>
	
	<script>
		$(document).ready(function() {
			$("#curDateTime").text((new Date()).toString());
		});
	</script>
</head>
<body onload="init()">
	<div class="reportHeader">
	  	<span><img class="logo" src="img/TO.png"/> MBT Execution Batches</span>
	  	<span id="curDateTime" style="float:right; top: 15px; position:relative;font-size:xx-small;"></span>
	</div>
  	<table border="0" cellspacing="1" cellpadding="2" width="100%">
	  	<thead>
	  		<tr>
	  			<th width="5%">BatchID</th>
	  			<th>Description</th>
	  			<th width="20%">Start Date/Time</th>
	  			<th width="10%">Submitted By</th>
	  			<th width="5%">Model Executions</th>
	  		</tr>
	  	</thead>
	  	<tbody>
	  		<xsl:for-each select="batch">
	  		<tr>
	  			<td align="center"><a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=View Batch Exec&amp;BATCHID=<xsl:value-of select="@batchID"/></xsl:attribute><xsl:value-of select="@batchID"/></a></td>
	  			<td><xsl:value-of select="@desc"/></td>
	  			<td align="center"><xsl:value-of select="@startTS"/></td>
	  			<td align="center"><xsl:value-of select="@submitEmail"/></td>
	  			<td align="center"><xsl:value-of select="count(modelList/model)"/></td>
	  		</tr>
	  		</xsl:for-each>
	  	</tbody>
	</table>
  </body>
  </html>
</xsl:template>


</xsl:stylesheet>
