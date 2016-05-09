<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
  version="2.0"
  xmlns:xs="http://www.w3.org/2001/XMLSchema">
<!-- Test Report: http://localhost:8004/MbtSvr/app=webrpt&name=CoverageByModels&modelList=ALM_Demonstration&comments=test%20the%20report -->
<xsl:template match="/CoverageByModelsWS">
<html>
<head>
	<link type="text/css" href="css/webRpt.css" rel="stylesheet" />
	<script src="packages/jquery-1.8.3.min.js"></script>
  	<LINK href="packages/tablesorter/themes/blue/style.css" rel="stylesheet" type="text/css"/>
	<script src="packages/tablesorter/jquery.metadata.js"></script>
	<script src="packages/tablesorter/jquery.tablesorter.min.js"></script>
	
	<style>
		body {
			background-color: #FDFDFD;
		}
		
		thead {
			background-color: #EEEEEE;
		}
		.comments {
			padding-left: 3px;
			font-size: medium;
			width: 100%;
		}
	</style>
	
	<script>
		$(document).ready(function() {
			$("#curDateTime").text((new Date()).toString());
//			$("th").addClass("header {sorter 'text'}");
			$("#ModelCoverage").tablesorter();
		});
	</script>
</head>
<body>
	<div class="reportHeader">
	  	<span><img class="logo" src="img/TO.png"/> MBT Requirement Coverage by Models</span>
	  	<span id="curDateTime" style="float:right; top: 15px; position:relative;font-size:xx-small;"></span>
	</div>
	<div class="comments">
  		Notes: <xsl:value-of select="comments"/>
	</div>
  	<table id="ModelCoverage" border="0" cellspacing="1" cellpadding="2" width="100%" class="tablesorter">
	  	<thead>
	  		<tr>
	  			<th>Req. Tag</th>
	  			<th>Model Name</th>
	  			<th>State Name</th>
	  			<th>Transition Name</th>
	  			<th>Coverages</th>
	  		</tr>
	  	</thead>
	  	<tbody>
	  		<xsl:for-each select="ModelCoverage">
				<xsl:variable name="ModelName"><xsl:value-of select="ModelName"/></xsl:variable>
		  		<xsl:for-each select="CoverageList/entry">
					<xsl:variable name="ReqTag"><xsl:value-of select="string"/></xsl:variable>
			  		<xsl:for-each select="list/Coverage">
	  		<tr>
	  			<td><xsl:value-of select="$ReqTag"/></td>
	  			<td><a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=Model Review&amp;model=<xsl:value-of select="$ModelName"/></xsl:attribute><xsl:value-of select="$ModelName"/></a></td>
	  			<td><xsl:value-of select="StateName"/></td>
	  			<td><xsl:value-of select="TransName"/></td>
	  			<td>
			  		<xsl:for-each select="CoverageTypes/string">
		  				<xsl:value-of select="."/>&#160;  
	  				</xsl:for-each>
	  			</td>
	  		</tr>

		  			</xsl:for-each>
	  			</xsl:for-each>
	  		</xsl:for-each>
	  	</tbody>
	</table>
  </body>
  </html>
</xsl:template>


</xsl:stylesheet>
