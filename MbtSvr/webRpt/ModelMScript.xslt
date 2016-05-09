<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<!--  WEBRPT_Model\ MScript=ModelMScript.xslt;Y;@CURSVR@/MbtSvr/app\=websvc&action\=stat&components\=Scxml,MScript&model\=@MODEL@  -->
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
			padding-left: 15px;
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
  			 <a><xsl:attribute name="href">/MbtSvr/app=webrpt&amp;name=Model Stats List&amp;MODEL=<xsl:value-of select="@modelName"/></xsl:attribute>Execution Stats</a>
			</small>
		</h3>
		<div id="sidetreecontrol"><a href="?#">Collapse All</a> | <a href="?#">Expand All</a></div>

		<ul id="stateList">
	  		<li class="closed">Model Triggers
	  			<ul>
	  				<xsl:for-each select="/WebSvcStats/mscript/mbt/script[count(child::*) &gt; 0]">
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
	  	<span><img class="logo" src="img/TO.png"/> Model MScript Report: <xsl:value-of select="@modelName"/></span>
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
		<ul class="transList">
			  		<xsl:for-each select="/WebSvcStats/mscript/state[@id=$stateID]/script[count(child::*) &gt; 0]">
			  			<xsl:if test="count(*) &gt; 0">
			  			<li class="closed"><span class="nodeLabel">Trigger: <xsl:value-of select="@type"/></span>
			  			<ul class="mscript">
			  			<pre><xsl:apply-templates /></pre>
			  			</ul>
						</li>
			  			</xsl:if>
					</xsl:for-each>	 
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
		<span class="nodeLabel trans">Trans: <xsl:value-of select="@event"/> -> <xsl:value-of select="@target"/>
			<span class="complexity" title="MScript Cyclomatic Complexity: DC - Decision Conditions, MDC - Modified Decision Conditions">
				DC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/@dc"/>,  
				MDC: <xsl:value-of select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/@mdc"/>
			</span>
		</span>
		<ul class="transAttrList">
 		<xsl:for-each select="/WebSvcStats/mscript/state[@id=$stateID]/transition[@event=$transID]/script[count(child::*) &gt; 0]">
  			<xsl:if test="count(*) &gt; 0">
				<xsl:variable name="triggerType" select="@type"/>
	 			<li class="closed">
	 				<span class="nodeLabel trigger">Trigger: <xsl:value-of select="@type"/>
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

<xsl:template match="assert">Assert "<xsl:value-of select="@value1"/>" <xsl:value-of select="@op"/> "<xsl:value-of select="@value2"/>", Else <xsl:value-of select="@else"/></xsl:template>

<xsl:template match="if">If "<xsl:value-of select="@value1"/>" <xsl:value-of select="@op"/> "<xsl:value-of select="@value2"/>" <xsl:apply-templates/>End-If</xsl:template>
<xsl:template match="then">Then <xsl:apply-templates/>End-Then</xsl:template>
<xsl:template match="else">Else <xsl:apply-templates/>End-Else</xsl:template>

<xsl:template match="while">While "<xsl:value-of select="@value1"/>" <xsl:value-of select="@op"/> "<xsl:value-of select="@value2"/>" (max: <xsl:value-of select="@maxLoopNum"/>): <xsl:apply-templates/>End-While</xsl:template>

<xsl:template match="log">Log <xsl:value-of select="@message"/></xsl:template>

<xsl:template match="seqout">Seqout <xsl:value-of select="output"/>End-Seqout</xsl:template>

<xsl:template match="func">Function <xsl:value-of select="@name"/><xsl:apply-templates/>End-Function</xsl:template>

</xsl:stylesheet>
