<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!-- WEBRPT_Model\ Review=ModelReview.xslt;Y;@CURSVR@/MbtSvr/app\=websvc&action\=stat&components\=Scxml,MScript&model\=@MODEL@ -->
<xsl:template match="/">
<html>
<head>
	<script src="packages/jquery-1.8.3.min.js"></script>
	<link rel="stylesheet" href="packages/treeview/jquery.treeview.css" />
	<script src="packages/jquery.cookie.js" type="text/javascript"></script>
	<script src="packages/treeview/jquery.treeview.js" type="text/javascript"></script>

	<link type="text/css" href="css/webRpt.css" rel="stylesheet" />
	<style>
		.stateAttr {
			margin-left: 2px;
			margin-right: 2px;
			padding-left: 3px;
			font-size: x-small;
			font-style: italic;
		}
		
		.mscript {
			border: 1px solid orange;
		}
		
		#headerTable {
			background-color: #EEEEEE;
		}
		
		.complexity {
			float: right;
			font-size: x-small;
			padding-right: 3px;
		}
		
		pre {
			padding-left: 0px;
			margin-left: 0px;
		}
		
	</style>
	
	<script>
		$(document).ready(function() {
			$("#stateList").treeview({control:"#sidetreecontrol"});
			$("#curDateTime").text((new Date()).toString());
		});
		
	</script>
</head>
<body>
	<xsl:for-each select="WebSvcStats/scxml">
		<xsl:call-template name="modelTemplate" />
	<div id="stateTrans">
		<h3>States and Transitions 
			- see <small><a><xsl:attribute name="href">GraphModel.html?type=modelGraph&amp;modelName=<xsl:value-of select="@modelName"/></xsl:attribute>model graph</a>, 
  			 <a href="StatsRpt_Main.html">Execution Stats</a>
			</small>
		</h3>
		<div id="sidetreecontrol"><a href="?#">Collapse All</a> | <a href="?#">Expand All</a></div>

		<ul id="stateList">
	  		<li class="closed">Model Triggers
	  			<ul>
		  			<xsl:for-each select="/WebSvcStats/mscript/mbt/script">
			  			<li class="closed"><span>Trigger: </span><xsl:value-of select="@type"/>
				  			<ul class="mscript">
					  			<pre><xsl:apply-templates /></pre>
				  			</ul>
						</li>
					</xsl:for-each>
				</ul>
			</li>
			<xsl:for-each select="state">
				<xsl:call-template name="stateTemplate"/>
			</xsl:for-each>
		</ul>
	</div>
	
	</xsl:for-each>
  </body>
  </html>
</xsl:template>

<xsl:template name="modelTemplate">
	<div class="reportHeader">
	  	<span><img class="logo" src="img/TO.png"/> Model Review: <xsl:value-of select="@modelName"/></span>
	  	<span id="curDateTime" style="float:right; top: 15px; position:relative;font-size:xx-small;"></span>
	</div>
	<table border="1" id="headerTable" cellspacing="0" cellpadding="2" width="100%">
		<tr>
			<td class="label" align="left">Description</td><td colspan="3" align="left"><xsl:value-of select="@description"/></td>
		</tr>
		<tr>
			<td width="10%" class="label" align="left">Model Version</td><td align="left"><xsl:value-of select="@versionModel"/>&#160;</td> 
			<td width="10%" class="label" align="left">TO Version</td><td align="left"><xsl:value-of select="@versionTO"/>&#160;</td> 
		</tr>
		<tr>
			<td class="label" align="left">AUT&#160;Version</td><td align="left"><xsl:value-of select="@versionAUT"/>&#160;</td> 
			<td class="label" align="left">UIMap&#160;URI</td><td align="left"><xsl:value-of select="@uiMapUri"/>&#160;</td> 
		</tr>
		<tr>
			<td class="label" align="left">Requirement&#160;Version</td><td align="left"><xsl:value-of select="@versionTag"/>&#160;</td> 
			<td class="label" align="left">Requirement&#160;URI</td><td align="left"><xsl:value-of select="@tagUri"/>&#160;</td> 
		</tr>
		<tr>
			<td class="label" align="left">Plugins</td><td align="left"><xsl:value-of select="@pluginidlist"/>&#160;</td> 
			<td class="label" align="left">Browser</td><td align="left"><xsl:value-of select="@browser"/>&#160;<xsl:value-of select="@browserversion"/></td> 
		</tr>
		<tr>
			<td class="label" align="left">Action Delay</td><td align="left"><xsl:value-of select="@actiondelaymillis"/>&#160;</td> 
			<td class="label" align="left">MScript Delay</td><td align="left"><xsl:value-of select="@mscriptdelaymillis"/>&#160;</td> 
		</tr>
		<xsl:for-each select="mbt">
		<tr>
			<td class="label" align="left">Optimization&#160;Objective</td><td align="left"><xsl:value-of select="@objective"/>&#160;</td> 
			<td class="label" align="left">Coverage Type</td><td align="left"><xsl:value-of select="@coveragetype"/>&#160;</td> 
		</tr>
		<tr>
			<td class="label" valign="top" align="left">Sequencer</td><td align="left"><xsl:value-of select="@mbtmode"/>
		<xsl:if test="@seed &gt; 0"> (seed: <xsl:value-of select="@seed"/>)</xsl:if>
			</td> 
			<td rowspan="2" class="label" valign="top" align="left">Stop Conditions</td>
			<td rowspan="2" valign="top" align="left">
					<xsl:if test="@stopcoverage &gt; 0"><span>Stop Transition Coverage: <xsl:value-of select="@stopcoverage"/>%</span><br/></xsl:if>
					<xsl:if test="@stopcount &gt; 0"><span>Stop Traversal Count: <xsl:value-of select="@stopcount"/>%</span><br/></xsl:if>
					<xsl:if test="@stoptime &gt; 0"><span>Stop Time (minutes): <xsl:value-of select="@stoptime"/>%</span><br/></xsl:if>
					<xsl:if test="@stophomeruncount &gt; 0"><span>Stop HomeRun: <xsl:value-of select="@stophomeruncount"/>%</span><br/></xsl:if>
					<xsl:if test="@stopexception &gt; 0"><span>Stop Exception Count: <xsl:value-of select="@stopexception"/>%</span><br/></xsl:if>
					&#160;
			</td> 
		</tr>
		
		<tr>
			<td class="label" valign="top" align="left">Cyclomatic Complexity</td>
			<td align="left">
		<xsl:choose>
		<xsl:when test="../@modelCC &gt; ../@mainCC">
			<ul>
				<li>Main Model: <xsl:value-of select="../@mainCC"/></li>
				<li>Entire Model: <xsl:value-of select="../@modelCC"/></li>
			</ul>
		</xsl:when>
		<xsl:otherwise>
				<xsl:value-of select="../@mainCC"/>
		</xsl:otherwise>
		</xsl:choose>
			</td> 
		</tr>
		
		</xsl:for-each>
	</table> 

</xsl:template>

<xsl:template name="stateTemplate">
		<xsl:variable name="stateID" select="@id"/>
	<li><span class="nodeLabel">State: <xsl:value-of select="@id"/> 
			<span class="complexity" title="MScript Cyclomatic Complexity: DC - Decision Conditions, MDC - Modified Decision Conditions">
				DC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/@dc"/>,
				MDC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/@mdc"/>
			</span>
	
			<xsl:if test="@initial='Y'"><span class="stateAttr">Initial</span></xsl:if>
			<xsl:if test="@final='Y'"><span class="stateAttr">Final</span></xsl:if>
			<xsl:if test="string-length(normalize-space(@subModel))>0"><span class="stateAttr">Sub Model State: <xsl:value-of select="@subModel"/></span></xsl:if>
			<xsl:if test="@activateType!='TRAV_COUNT' and @activateThreshold>1"><span class="stateAttr">Activate Type: <xsl:value-of select="@activateType"/>
				(<xsl:if test="string-length(normalize-space(@activateThreashold))&lt;=0">1</xsl:if><xsl:if test="string-length(normalize-space(@activateThreashold))>0"><xsl:value-of select="@activateThreashold"/></xsl:if>, <xsl:value-of select="@firingType"/>)</span>
			</xsl:if>
		</span>
		<xsl:variable name="stateID" select="@id"/>
		<ul class="transList">
			<li class="closed"><span class="nodeLabel">Attributes</span>
				<ul class="closed">
 				<li>Description:<xsl:value-of select="@description"/></li>
 				<xsl:if test="string-length(normalize-space(@tags))>0"><li>Tags: <xsl:value-of select="@tags"/></li></xsl:if>
			  		<xsl:for-each select="/WebSvcStats/mscript/state[@id=$stateID]/script">
			  			<xsl:if test="count(*) &gt; 0">
			  			<li class="closed"><span class="nodeLabel">Trigger: <xsl:value-of select="@type"/></span>
			  			<ul class="mscript">
			  			<pre><xsl:apply-templates /></pre>
			  			</ul>
						</li>
			  			</xsl:if>
					</xsl:for-each>	 
				</ul>
			</li>
			<xsl:for-each select="transition">
				<xsl:call-template name="transTemplate">
					<xsl:with-param name="stateID" select="$stateID"/>
				</xsl:call-template>
			</xsl:for-each>
			<xsl:for-each select="state">
				<xsl:call-template name="stateTemplate"/>
			</xsl:for-each>
		</ul>
	</li>

</xsl:template>

<xsl:template name="transTemplate">
	<xsl:param name="stateID"/>
	<xsl:variable name="transID" select="@event"/>
	<li class="closed">
		<span class="nodeLabel">Trans: <xsl:value-of select="@event"/> -> <xsl:value-of select="@target"/>
			<span class="complexity" title="MScript Cyclomatic Complexity: DC - Decision Conditions, MDC - Modified Decision Conditions">
				DC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/@dc"/>,  
				MDC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/@mdc"/>
			</span>
		</span>
		<ul class="transAttrList">
			<li>Description: <xsl:value-of select="@description"/></li>
			<xsl:if test="string-length(normalize-space(@tags))>0"><li>Tags: <xsl:value-of select="@tags"/></li></xsl:if>
			<xsl:if test="string-length(normalize-space(@dataset))>0"><li>DataSet Name: <xsl:value-of select="@dataset"/></li></xsl:if>
			<xsl:if test="string-length(normalize-space(@submodelFinalState))>0"><li>Submodel Final State: <xsl:value-of select="@submodelFinalState"/></li></xsl:if>
			<li>Transition Weight: <xsl:value-of select="@weight"/></li>
			<li>Traversal Required: <xsl:value-of select="@traverses"/></li>
			<xsl:if test="string-length(normalize-space(@set))>0"><li>Set: <xsl:value-of select="@set"/></li></xsl:if>
			<xsl:if test="string-length(normalize-space(@guard))>0"><li>Guard: <xsl:value-of select="@guard"/></li></xsl:if>
 		<xsl:for-each select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/script">
  			<xsl:if test="count(*) &gt; 0">
				<xsl:variable name="triggerType" select="@type"/>
	 			<li class="closed">
	 				<span class="nodeLabel">Trigger: <xsl:value-of select="@type"/>
						<span class="complexity" title="MScript Cyclomatic Complexity: DC - Decision Conditions, MDC - Modified Decision Conditions">
							DC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/script[@type=$triggerType]/@dc"/>,  
							MDC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/script[@type=$triggerType]/@mdc"/>
						</span>
	 				</span>
	 			<ul class="mscript">
	 			<pre><xsl:apply-templates /></pre>
	 			</ul>
				</li>
	 		</xsl:if>
	</xsl:for-each>	 
		</ul>
	</li>
</xsl:template>

<xsl:template match="action">Action <xsl:value-of select="@code"/></xsl:template>
<!-- fix supplied by James Barton, DDI Health, 8/1/2012 -->
<xsl:template match="assert">  
<xsl:choose>
<xsl:when test="/WebSvcStats/scxml[@pluginidlist='SeqOutHtml']"><span style="word-wrap: break-word; white-space: pre-wrap;"> <xsl:value-of select="@passed"/> </span></xsl:when>
<xsl:otherwise><span style="word-wrap: break-word; white-space: pre-wrap;">Assert "<xsl:value-of select="@value1"/>" <xsl:value-of select="@op"/> "<xsl:value-of select="@value2"/>", Else <xsl:value-of select="@else"/>, Passed "<xsl:value-of select="@passed"/>"</span></xsl:otherwise>
</xsl:choose>
</xsl:template>
<xsl:template match="if">If "<xsl:value-of select="@value1"/>" <xsl:value-of select="@op"/> "<xsl:value-of select="@value2"/>" <xsl:apply-templates/>End-If</xsl:template>
<xsl:template match="then">Then <xsl:apply-templates/>End-Then</xsl:template>
<xsl:template match="else">Else <xsl:apply-templates/>End-Else</xsl:template>

<xsl:template match="while">While "<xsl:value-of select="@value1"/>" <xsl:value-of select="@op"/> "<xsl:value-of select="@value2"/>" (max: <xsl:value-of select="@maxLoopNum"/>): <xsl:apply-templates/>End-While</xsl:template>

<xsl:template match="log">Log <xsl:value-of select="@message"/></xsl:template>

<xsl:template match="seqout">Seqout <xsl:value-of select="output"/>End-Seqout</xsl:template>

<xsl:template match="func">Function <xsl:value-of select="@name"/><xsl:apply-templates/>End-Function</xsl:template>

</xsl:stylesheet>
