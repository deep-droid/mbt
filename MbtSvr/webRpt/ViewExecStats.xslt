<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
<!--  WEBRPT_View\ Exec\ Stats=ViewExecStats.xslt;N;@CURSVR@/MbtSvr/app\=websvc&action\=stat&components\=MbtStat&modelName\=@MODEL@&execID\=@EXECID@  -->

<xsl:template match="/WebSvcStats/MbtStat">
<html>
<head>
	<link type="text/css" href="css/webRpt.css" rel="stylesheet" />
	<script src="packages/jquery-1.8.3.min.js"></script>
	
	<style>
		#summary {
			background-color: #EEEEEE;
		}
		
		#stateTrans {
			margin-top: 8px;
			border: 1px solid #AAAAAA;
		}
		
		table {
			margin-bottom: 5px;
		}
		
		#stateTrans thead, #tags thead, #sequence thead {
			background-color: #DDDDDD;
		}
		
		#tags {
			margin-top: 8px;
			border: 1px solid #DDDDDD;
		}

		.exception {
			margin-left: 10px;
		}
		
		.tagMsg_true, .tagMsg_false, .travFailedMsg {
			display: none;
		}
		
		.tagMsg_true, .tagMsgPassedCount {
			color: green;
		}

		.tagMsg_false, .tagMsgFailedCount, .tagNoCoverage, .travFailedCount, .exception {
			color: red;
		}
		
		.tagMsgPassedCount:hover, .tagMsgFailedCount:hover, .travFailedCount:hover {
			text-decoration: underline;
			color: blue;
		}
				
		tbody tr:hover {
			background-color: #EEEEEE;
		}
		
	</style>
	
	<script>
		$(document).ready(function() {
			$("#curDateTime").text((new Date()).toString());
			$(".tagMsgPassedCount").click(function() {
				$(this).parent().next().find(".tagMsg_true").toggle();
			});
			
			$(".tagMsgFailedCount").click(function() {
				$(this).parent().next().find(".tagMsg_false").toggle();
			});
			
			$(".travFailedCount").click(function() {
				$(this).parent().next().toggle();
			});
			
			$(".travFailedMsg").click(function() {
				$(this).hide();
			});

			$(".tagMsg_true").click(function() {
				$(this).parent().parent().find(".tagMsg_true").hide();
			});
			$(".tagMsg_false").click(function() {
				$(this).parent().parent().find(".tagMsg_false").hide();
			});
		});
	</script>
</head>
<body>
	<div class="reportHeader">
	  	<span><img class="logo" src="img/TO.png"/> Model Execution Stats for: <a title="Click to goto Model Review"><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=Model Review&amp;MODEL=<xsl:value-of select="@model" /></xsl:attribute><xsl:value-of select="@model" /></a></span>
	  	<span id="curDateTime" style="float:right; top: 15px; position:relative;font-size:xx-small;"></span>
	</div>

  	<table id="summary" border="1" cellspacing="0" cellpadding="2" width="100%">
	  	<thead>
	  		<tr>
	  			<td colspan="4">
	  			  	<div style="padding-top: 8px; padding-bottom: 5px;">
				  	<xsl:if test="@batchID > 0">
				  		Part of batch execution: <a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=View Batch Exec&amp;BATCHID=<xsl:value-of select="@batchID"/></xsl:attribute><xsl:value-of select="@batchDesc"/></a><br/>
				  	</xsl:if>
				  		Back to: <a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=Model Stats List&amp;MODEL=<xsl:value-of select="@model"/></xsl:attribute>Model Execution Stats List</a>
				 	</div>
				</td>
	  		</tr>
	  	</thead>
	  	<tbody>
	  		<xsl:for-each select="TraversalStat">
	  		<tr>
	  			<td class="label">Execution Description</td><td colspan="3"><xsl:value-of select="@statDesc"/></td>
	  		</tr>
	  		<tr>
	  			<td class="label" width="10%">Sequencer</td><td><xsl:value-of select="@mbtMode"/></td>
	  			<td class="label">Plugin(s)</td><td><xsl:value-of select="@pluginID"/></td>
	  		</tr>
	  		<tr>
	  			<td class="label" width="10%">Virtual Users</td><td><xsl:value-of select="@numThread"/></td>
	  			<td class="label">Iterations</td><td><xsl:value-of select="@numLoop"/></td>
	  		</tr>
	  		<tr>
	  			<td class="label">Browser</td><td><xsl:value-of select="@browserType"/></td>
	  			<td class="label">Exceptions</td><td><xsl:value-of select="@totalExceptCount"/></td>
	  		</tr>
	  		<tr>
	  			<td class="label">Start Time</td><td><xsl:value-of select="@startTime"/></td>
	  			<td class="label">End Time</td><td><xsl:value-of select="@endTime"/></td>
	  		</tr>
	  		<tr>
	  			<td class="label">State Coverage</td><td><xsl:value-of select="@stateCoveragePct"/>%</td>
	  			<td class="label">State Covered</td><td><xsl:value-of select="@visitedStateCount"/></td>
	  		</tr>
	  		<tr>
	  			<td class="label">Transition Coverage</td><td><xsl:value-of select="@transCoveragePct"/>%</td>
	  			<td class="label">Transition Covered</td><td><xsl:value-of select="@traversedTransCount"/></td>
	  		</tr>
	  		</xsl:for-each>
	  		<xsl:for-each select="TagStat">
	  		<tr>
	  			<td class="label">Tag Coverage</td><td><xsl:value-of select="@tagsCoverage" />%</td>
	  			<td class="label">Tags Covered</td><td><xsl:value-of select="@tagsCoveredCount" /></td>
	  		</tr>
	  		</xsl:for-each>
	  	</tbody>
	</table>
	<table id="stateTrans" cellpadding="2" cellspacing="1" width="100%">
	  	<thead>
	  		<tr>
	  			<th colspan="9">Traversal Stats</th>
	  		</tr>
	  		<tr>
	  			<th rowspan="2" align="left">State/Transition</th>
	  			<th colspan="3">Traversals</th>
	  			<th colspan="5">Performance (ms)</th>
	  		</tr>
	  		<tr>
	  			<th>Required</th>
	  			<th>Actual</th>
	  			<th>Failed</th>
	  			<th>Average</th>
	  			<th>Min</th>
	  			<th>Max</th>
	  			<th>Expected</th>
	  			<th>Slow Count</th>
	  		</tr>
	  	</thead>
	  	<tbody>
        	<xsl:for-each select="/WebSvcStats/MbtStat/TraversalStat/TraversalList/Traversal">
	          	<xsl:sort select="concat(@state,':',@trans)"/>
	  		<tr>
	  			<xsl:choose>
	  			<xsl:when test="@event">
	  				<td valign="top"><xsl:value-of select="@state"/>: <xsl:value-of select="@event" /></td>
		  			<td valign="top" align="center">
		  				<xsl:if test="@reqTravCount &gt; 0">
		  					<xsl:value-of select="@reqTravCount" />
	  					</xsl:if>
		  			</td>
	  			</xsl:when>
	  			<xsl:otherwise>
	  				<td valign="top" colspan="2"><xsl:value-of select="@state"/></td>
	  			</xsl:otherwise>
	  			</xsl:choose>
	  			<td valign="top" align="center"><xsl:value-of select="@travCount" /></td>
	  			<td valign="top" align="center" class="travFailedCount">
	  				<xsl:if test="@exceptionCount &gt; 0">
		  				<xsl:value-of select="@exceptionCount" />
	  				</xsl:if>
	  			</td>
	  			<td valign="top" align="center"><xsl:value-of select="Perf/@avg" /></td>
	  			<td valign="top" align="center"><xsl:value-of select="Perf/@min" /></td>
	  			<td valign="top" align="center"><xsl:value-of select="Perf/@max" /></td>
	  			<td valign="top" align="center"><xsl:value-of select="Perf/@expected" /></td>
				<td valign="top" align="center"><xsl:value-of select="Perf/@slowRespCount" /></td>
	  		</tr>
			<xsl:if test="count(Exception) &gt; 0">
				<tr class="travFailedMsg">
				<td colspan="9">
					<div class="exception">
					<xsl:for-each select="Exception">
						Level: <xsl:value-of select="@level"/>
						<ul>
							<xsl:for-each select="message">
								<li>
									<xsl:value-of select="."></xsl:value-of>
								</li>
							</xsl:for-each>
						</ul>
					</xsl:for-each>
					</div>
				</td>
				</tr>
			</xsl:if>
        			
          	</xsl:for-each>

	  	</tbody>
	</table>

	<table id="tags" cellpadding="2" cellspacing="1" width="100%">
	  	<thead>
	  		<tr>
	  			<th colspan="7">Tag Coverage Stats</th>
	  		</tr>
	  		<tr>
	  			<th align="left">Req. Tag</th>
	  			<th>P</th>
	  			<th>State/Node</th>
	  			<th>Transition/Edge</th>
	  			<th>AssertID</th>
	  			<th>Pass Count</th>
	  			<th>Fail Count</th>
	  		</tr>
	  	</thead>
	  	<tbody>
	  		<xsl:for-each select="/WebSvcStats/MbtStat/TagStat/TagList/Tag">
				<xsl:variable name="tagID"><xsl:value-of select="@tagID"/></xsl:variable>
				<xsl:variable name="priority"><xsl:value-of select="@priority"/></xsl:variable>
				<xsl:if test="count(assert)=0">
			  		<tr>
			  			<td valign="top">
			  				<xsl:value-of select="$tagID"/>
			  			</td>
			  			<td valign="top" align="center">
			  				<xsl:value-of select="$priority"/>
			  			</td>
			  			<td colspan="5" align="center" class="tagNoCoverage">No Coverage</td>
		  			</tr>
				</xsl:if>
		  		<xsl:for-each select="assert">
			  		<tr>
			  			<td valign="top">
			  				<xsl:value-of select="$tagID"/>
			  			</td>
			  			<td valign="top" align="center">
			  				<xsl:value-of select="$priority"/>
			  			</td>
			  			<td><xsl:value-of select="@state"/></td>
			  			<td><xsl:value-of select="@trans"/></td>
			  			<td><xsl:value-of select="@assertID"/></td>
			  			<td align="center" class="tagMsgPassedCount" title="click to show/hide messages"><xsl:value-of select="@passedCount" /></td>
						<td align="center" class="tagMsgFailedCount" title="click to show/hide messages">
							<xsl:if test="@failedCount &gt; 0">
								<xsl:value-of select="@failedCount" />
							</xsl:if>
						</td>
					</tr>
					
			  		<tr>
			  			<td colspan="2"></td>
				  		<td colspan="5"><ul>
			  		<xsl:for-each select="execMsg">
			  			<xsl:variable name="passedClass">tagMsg_<xsl:value-of select="@passed"/></xsl:variable>
			  			<li><xsl:attribute name="class"><xsl:value-of select="$passedClass"/></xsl:attribute>
		  				<xsl:value-of select="."/>
			  			</li>
					</xsl:for-each>
				  		</ul>
				  		</td>
					</tr>
					
		  		</xsl:for-each>
	  		</xsl:for-each>
	  	</tbody>
	</table>
	<table id="sequence" cellpadding="2" cellspacing="1" width="100%">
	  	<thead>
	  		<tr>
	  			<th colspan="4">Test Sequence</th>
	  		</tr>
	  		<tr>
	  			<th align="left" width="160px">Timestamp</th>
	  			<th>Thread</th>
	  			<th align="left">State</th>
	  			<th align="left">Transition</th>
	  		</tr>
	  	</thead>
	  	<tbody>
	  		<xsl:for-each select="/WebSvcStats/MbtStat/TraversalStat/SeqLog/Sequence">
	  		<tr>
	  			<td valign="top"><xsl:value-of select="@timestamp"/></td>
	  			<td valign="top" align="center"><xsl:value-of select="@thread" /></td>
				<td valign="top" align="left"><xsl:value-of select="@state" /></td>
				<td valign="top" align="left"><xsl:value-of select="@trans"/></td>
			</tr>
			<xsl:if test="count(errMsg) &gt; 0">
				<tr><td colspan="4">
				<ul class="exception">
	  		<xsl:for-each select="errMsg">
	  			<li><xsl:value-of select="."/></li>
	  		</xsl:for-each>
				</ul>
				</td></tr>
			</xsl:if>
	  		</xsl:for-each>
	  		
	  		<xsl:for-each select="/WebSvcStats/MbtStat/TraversalStat/Exception">
	  		<tr class="exception">
	  			<td valign="top">System Exception - <xsl:value-of select="@level" /></td>
	  			<td valign="top" align="left" colspan="3">
		  			<ul>
	  				<xsl:for-each select="message">
	  					<li><xsl:value-of select="." /></li>
	  				</xsl:for-each>
	  				</ul>
	  			</td>
			</tr>
	  		</xsl:for-each>
	  	</tbody>
	</table>
  </body>
  </html>
</xsl:template>


</xsl:stylesheet>
