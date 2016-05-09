<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:math="http://www.jclark.com/xt/java/java.lang.Math"
xmlns:java="http://xml.apache.org/xslt/java"  
exclude-result-prefixes="java"
	version="1.0">
	
<xsl:template name="ReqTableBuilder">
	<xsl:param name="startPos"></xsl:param>
	<xsl:param name="endPos"></xsl:param>
	<xsl:variable name="tagPriorityListTag" select="tagPriorityList/tag[position() &gt;= $startPos and position() &lt; $endPos]"/>
	<xsl:variable name="tagCount" select="count($tagPriorityListTag)"/>
	<xsl:if test="$tagCount &gt; 0">
			<table border="1" cellpadding="0px" cellspacing="0px" id="tcList" style="margin-top: 2px;">
		<xsl:for-each select="$tagPriorityListTag">
			<colgroup align="center" valign="top"><xsl:attribute name="class">colReq<xsl:value-of select="position() -1 + $startPos"/></xsl:attribute></colgroup>
		</xsl:for-each>
				<tr>
					<th class="tlabel" valign="middle" rowspan="2">TC#</th>
					<th class="tlabel" valign="middle" rowspan="2">Weight</th>
					<th class="tlabel" valign="middle" rowspan="2">Length</th>
					<th class="tlabel" align="center"><xsl:attribute name="colspan"><xsl:value-of select="$tagCount"/></xsl:attribute>Requirement Tags</th>
				</tr>
				<tr>
		<xsl:for-each select="$tagPriorityListTag">
					<th class="tlabel"><xsl:attribute name="class">p_<xsl:value-of select="priority"/></xsl:attribute><xsl:attribute name="title">Priority <xsl:value-of select="priority"/></xsl:attribute><xsl:value-of select="tag"/><sup><xsl:value-of select="priority"/></sup></th>
		</xsl:for-each>
				</tr>
		<xsl:if test="count(mbtStartList/item) &gt; 0">
				<tr>
					<th colspan="2" align="center" class="colTC"><a href="#PREAMBLE">Preamble</a></th><td>&#160;</td>
			<xsl:for-each select="$tagPriorityListTag">
					<td>&#160;</td>
			</xsl:for-each>
				</tr>
		</xsl:if>
		<xsl:for-each select="pathList/path">
				<xsl:variable name="tcID">TC<xsl:value-of select="format-number(position(), '0000')"/></xsl:variable>
				<tr><xsl:attribute name="class"><xsl:value-of select="$tcID"/>_ndx</xsl:attribute>
					<th align="left" class="colTC"><xsl:attribute name='tcID'><xsl:value-of select="$tcID"/></xsl:attribute>
						<a><xsl:attribute name='href'>#<xsl:value-of select="$tcID"/></xsl:attribute>
					 		<xsl:value-of select="$tcID"/>
					 		<xsl:if test="pathName != ''">
					 			- <xsl:value-of select="pathName"/>
					 		</xsl:if>
						</a>
					</th>
					<th><xsl:value-of select="pathWeight"/></th>
					<th><xsl:value-of select="count(stepList/step)"/></th>
			<xsl:variable name="pathPos" select="position()"/>
			<xsl:for-each select="$tagPriorityListTag">
					<xsl:variable name="curTag" select="tag"/>
					<xsl:variable name="matchCount" select="count(//suite/pathList/path[$pathPos]/pathTagList[item=$curTag])"/>
					<td><xsl:attribute name="onclick">javascript:gotoStep('<xsl:value-of select="$tcID"/>_<xsl:value-of select="tag"/>')</xsl:attribute>
					<xsl:if test="$matchCount &gt; 0">
						<xsl:attribute name="class">reqCheck</xsl:attribute>
						<xsl:attribute name="title">Covered but not executed</xsl:attribute>
						<xsl:attribute name="tag"><xsl:value-of select="tag"/></xsl:attribute>
					</xsl:if>
					<xsl:if test="$matchCount &lt; 1"><xsl:attribute name="title">No coverage</xsl:attribute></xsl:if>
					&#160;
					</td>
			</xsl:for-each>
				</tr>
		</xsl:for-each>			
		<xsl:if test="count(mbtEndList/item) &gt; 0">
				<tr>
					<th colspan="2" align="center" class="colTC"><a href="#POSTSCRIPT">Postscript</a></th><td>&#160;</td>
			<xsl:for-each select="$tagPriorityListTag">
					<td>&#160;</td>
			</xsl:for-each>
				</tr>
		</xsl:if>
			</table>
<div style="font-size:xx-small;width:100%;"><xsl:value-of select="java:format(java:java.text.SimpleDateFormat.new('mm:ss.ms'), java:java.util.Date.new())"/></div>
		<xsl:call-template name="ReqTableBuilder">
	   	 	<xsl:with-param name="startPos"><xsl:value-of select="$endPos"/></xsl:with-param>
	   	 	<xsl:with-param name="endPos"><xsl:value-of select="number($endPos) + number(fieldList/field[name='ReqTagColumnCount']/value)"/></xsl:with-param>
	  	</xsl:call-template>
	</xsl:if>
</xsl:template>

<xsl:template match="/suite">

  <xsl:text disable-output-escaping="yes"><![CDATA[
    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd
  ]]></xsl:text>

	<html>
	<head>
		<title>TestOptimal <xsl:value-of select="fieldList/field[name='TOVersion']/value"/> - TestCases (Licensed to <xsl:value-of select="fieldList/field[name='LicensedUser']/value"/>)</title> 
		<link href="seqout.css" rel="stylesheet" type="text/css" /> 
		<script src="jquery.js"></script>
		<script>
			var statusSelectStyle = true;
			<xsl:if test="fieldList/field[name='StatusStyle']/value='RADIO'">
				statusSelectStyle = false;
			</xsl:if>
			var totalReqCount = <xsl:value-of select="count(tagPriorityList/tag)"/>;
			var tcFormUID = '<xsl:value-of select="fieldList/field[name='TestCaseReportName']/value"/>';
		</script>
		<script src="seqout.js"></script>
	</head> 
	<body> 
	<form>
    	<xsl:attribute name="id"><xsl:value-of select="fieldList/field[name='TestCaseReportName']/value"/></xsl:attribute>
		<xsl:variable name="LinkGraph" select="fieldList/field[name='LinkGraph']/value"/>
		<div class="banner">
			<table width="100%" border="0">
				<tr>
					<td>
						<a><xsl:attribute name="href"><xsl:value-of select="fieldList/field[name='LogoImgURL']/value"/></xsl:attribute><img border="0" class="logoImg"><xsl:attribute name="src"><xsl:value-of select="fieldList/field[name='LogoImg']/value"/></xsl:attribute></img><xsl:value-of select="fieldList/field[name='Company']/value"/></a>
						<span id="reportTitle">
							Test Cases for Model <xsl:value-of select="modelName"/>
						</span> 
						<span class="TO_Release">
							<a class="TOLink" href="http://testoptimal.com/">TestOptimal <xsl:value-of select="fieldList/field[name='TOVersion']/value"/></a>
						</span>
					</td>
				</tr>
			</table>
		</div> 
		<div class="content" style="horizontal-align: left"> 
			<div class="MetaData" style="horizontal-align: center"> 
				<table border="1" id="headerTable" width="100%">
					<tr>
						<td class="label" align="left">Model&#160;Name:</td><td colspan="3" align="left"><xsl:value-of select="modelName"/>&#160;</td> 
					</tr>
					<tr>
						<td class="label" align="left">Description:</td><td colspan="3" align="left"><xsl:value-of select="modelDesc"/></td>
					</tr>
					<tr>
						<td class="label" align="left">AUT&#160;Version:</td><td align="left"><xsl:value-of select="autVersion"/>&#160;</td> 
						<td class="label" align="left">Requirements&#160;Version:</td><td align="left"><xsl:value-of select="tagVersion"/>&#160;</td> 
					</tr>
					<tr>
						<td class="label" align="left">Model&#160;Version:</td><td align="left"><xsl:value-of select="modelVersion"/>&#160;</td> 
						<td class="label" align="left">TestOptimal&#160;Version:</td><td align="left"><xsl:value-of select="fieldList/field[name='TOVersion']/value"/>&#160;</td> 
					</tr>
					<tr>
						<td class="label" align="left">Sequencer:</td><td align="left"><xsl:value-of select="fieldList/field[name='Sequencer']/value"/>
	<xsl:if test="count(fieldList/field[name='Seed']) &gt; 0"> (seed: <xsl:value-of select="fieldList/field[name='Seed']/value"/>)</xsl:if>
						</td> 
						<td class="label" rowspan="4" valign="top" align="left">Stop Conditions:</td>
						<td rowspan="4" valign="top" align="left">
								<xsl:if test="count(fieldList/field[name='StopCoverage']) &gt; 0"><span>Stop Coverage: <xsl:value-of select="fieldList/field[name='StopCoverage']/value"/>%</span><br/></xsl:if>
								<xsl:if test="count(fieldList/field[name='StopTraversalCount']) &gt; 0"><span>Stop Traversal Count: <xsl:value-of select="fieldList/field[name='StopTraversalCount']/value"/></span><br/></xsl:if>
								<xsl:if test="count(fieldList/field[name='StopTimeInMinutes']) &gt; 0"><span>Stop Time: <xsl:value-of select="fieldList/field[name='StopTimeInMinutes']/value"/> mins</span><br/></xsl:if>
								<xsl:if test="count(fieldList/field[name='StopPathCount']) &gt; 0"><span>Stop TestCase Count: <xsl:value-of select="fieldList/field[name='StopPathCount']/value"/></span><br/></xsl:if>
								<xsl:if test="count(fieldList/field[name='StopExceptionCount']) &gt; 0"><span>Stop Exception Count: <xsl:value-of select="fieldList/field[name='StopExceptionCount']/value"/></span><br/></xsl:if>
								&#160;
						</td> 
					</tr>
					<tr>
						<td class="label" align="left">Generation Date:</td><td align="left"><xsl:value-of select="pluginID"/>, <xsl:value-of select="genDate"/></td> 
					</tr>
					<tr>
						<td class="label" align="left">Coverage Type:</td>
						<td align="left"><xsl:value-of select="fieldList/field[name='CoverateType']/value"/>&#160;</td> 
					</tr>
					<tr>
						<td class="label" valign="top" align="left" nowrap="nowrap">Transition Coverage:</td><td valign="top" align="left"><xsl:value-of select="fieldList/field[name='TransitionCoverage']/value"/>% 
						</td> 
					</tr>
					<tr>
						<td class="label" valign="top" align="left" nowrap="nowrap">Test Case Count:</td><td valign="top" align="left"><xsl:value-of select="count(pathList/path)"/> 
						</td> 
						<td class="label" valign="top" align="left" nowrap="nowrap">Duplicate TestCases Removed:</td><td valign="top" align="left"><xsl:value-of select="fieldList/field[name='DuplicateRemoved']/value"/> 
						</td> 
					</tr>
				</table> 
				 
			</div> 
			<h2 style="margin-top: 1em;"><a name="model">Model / Coverage Graph</a></h2>
			<center class="lengend">Legend: <span style="color: #006600">DarkGreen - Covered</span>, <span style="color: #FF9900;">Gold - Partially Covered</span>, <span style="color: #CC0033">Red - Not Covered</span></center>

			<xsl:variable name="LinkCoverageGraph" select="fieldList/field[name='LinkCoverageGraph']/value"/>

			<div class="graph" align="center">
				<xsl:choose>
					<xsl:when test="$LinkCoverageGraph = 'Y'"><a><xsl:attribute name="href"><xsl:value-of select="fieldList/field[name='TestCaseReportName']/value"/>/coverage.png</xsl:attribute>Coverage Graph</a>
					</xsl:when>
					<xsl:otherwise>
					 	<img border="0"><xsl:attribute name="src"><xsl:value-of select="fieldList/field[name='TestCaseReportName']/value"/>/coverage.png</xsl:attribute></img>
					</xsl:otherwise>
				</xsl:choose>
			</div>
			<h2 style="margin-top: 1em;"><a name="INDEX">Requirement Traceability Table</a></h2>
	<xsl:variable name="ReqTagColumnCount" select="fieldList/field[name='ReqTagColumnCount']/value"/>
	<xsl:variable name="loopStart" select="1"/>
	<xsl:variable name="loopEnd" select="number($loopStart) + number($ReqTagColumnCount)"/>
	<xsl:call-template name="ReqTableBuilder">
   	 	<xsl:with-param name="startPos"><xsl:number value="number($loopStart)" /></xsl:with-param>
   	 	<xsl:with-param name="endPos"><xsl:number value="number($loopEnd)" /></xsl:with-param>
  	</xsl:call-template>
  			<div id="legends">
  				<div style="padding: 3px;">
  					<span>Priority: </span>
  						<ul class="legendPriority">
							<li class="p_C" style="color: #FFFFFF">critical<sup>C</sup></li>
							<li class="p_H" style="color: #FFFFFF">high<sup>H</sup></li>
							<li class="p_M" style="color: #FFFFFF">medium<sup>M</sup></li>
							<li class="p_L" style="color: #FFFFFF">low<sup>L</sup></li>
						</ul>	
				</div>
				<div style="float: right; position: relative; top: -25px; padding: 3px;">
					<span>Execution Status:</span>
						<ul class="legendStatus">
							<li style="background-color: #FFFFFF">not covered</li>
							<li class="reqCheck" style="color: #FFFFFF">not executed</li>
							<li class="partial" style="color: #FFFFFF">partial</li>
							<li class="passed" style="color: #FFFFFF">passed</li>
							<li class="failed" style="color: #FFFFFF">failed</li>
							<li class="blocked" style="color: #FFFFFF">blocked</li>
						</ul>	
				</div>	
			</div>

			<div style="display: block;" id="runComment"> 
			    <span class="label">Run Specific Details:</span> 
			    <div class="textwrapper">
			    	<textarea cols="2" rows="10" class="storeField">
				    	<xsl:attribute name="storeID">
				    		<xsl:value-of select="math:random()"/>
				    	</xsl:attribute>
			    	</textarea>
			    </div> 
			</div> 

	<xsl:variable name="showUpdateSection" select="//fieldList/field[name='UpdateSection']/value='true'"/>
	<xsl:variable name="updateModeSelect" select="//fieldList/field[name='StatusStyle']/value='SELECT'"/>
	<xsl:variable name="updateModeRadio" select="//fieldList/field[name='StatusStyle']/value='RADIO'"/>

	<xsl:if test="$showUpdateSection">
			<h2 class="summaryH2" style="margin-top: 1em;"><a name="SUMMARY">Execution Summary</a> <span id="completePct"></span> <a style="margin-left: 10px; font-size: medium;" href="javascript:buildExecSummary();">Update</a></h2> 
			<div class="index">
				<table id="summaryTbl" width="100%" border="1" cellspacing="2" cellpadding="2">
					<colgroup valign="top"></colgroup>
					<colgroup valign="top"></colgroup>
					<colgroup valign="top"></colgroup>
					<thead>
						<tr id="summaryHead">
							<th>Element</th><th>Measure (count / %)</th><th>Test Case/Requirement List</th>
						</tr>
					</thead>
					<tbody>
						<tr id="tcExecStatusHead" width="100%">
							<td colspan="3" align="center" width="100%">
								Test Case Execution Status
							</td>
						</tr>
						<tr id="casesAvailable" class="testcaseStat">
							<td>Test Cases Available</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="casesCompleted" class="testcaseStat">
							<td>Test Cases Completed</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="casesPassed" class="testcaseStat">
							<td>Test Cases Passed</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="casesFailed" class="testcaseStat">
							<td>Test Cases Failed</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="casesBlocked" class="testcaseStat">
							<td>Test Cases Blocked</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="casesNotRun" class="testcaseStat">
							<td>Test Cases Yet To Be Exercised</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>
						<tr id="reqExecStatusHead" width="100%">
							<td colspan="3" align="center" width="100%">
								Requirement Execution Status
							</td>
						</tr>
						<tr id="reqmtExecFull" class="reqStat">
							<td>Fully Executed</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="reqmtExecPartial" class="reqStat">
							<td>Partially Executed</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="reqmtPassed" class="reqStat">
							<td>Executed and Passed</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="reqmtFailed" class="reqStat">
							<td>Failed (incl. partially executed)</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="reqmtBlocked" class="reqStat">
							<td>Blocked (incl. partially executed)</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
						<tr id="reqmtNotRun" class="reqStat">
							<td>Not Executed</td>
							<td class="measure"></td>
							<td class="measureList"></td>
						</tr>					
-					</tbody>
				
				</table>
			</div>
			<hr />
	</xsl:if>
	<xsl:if test="count(mbtStartList/item) &gt; 0">
			<h2 class="preambleH2" style="margin-top: 1em;"><a name="PREAMBLE">PREAMBLE</a></h2> 
			<div class="index"><a href="#INDEX">Test Case List</a></div> 
				<div id="PREAMBLE" class="testcasedetail" style="horizontal-align: left"> 
					<ul>
		<xsl:for-each select="mbtStartList/item">
						<li><xsl:value-of select="message/." disable-output-escaping="yes"/></li>
		</xsl:for-each>
					</ul>
				</div><!-- End of testcase detail --> 
			<hr />
	</xsl:if>
	<xsl:for-each select="pathList/path">
		<xsl:if test="count(stepList/step) &gt; 0">
			<xsl:variable name="tcID">TC<xsl:value-of select="format-number(position(),'0000')"/></xsl:variable>
			<h2 class="testcaseH2" style="margin-top: 1em;">
				<a><xsl:attribute name='name'><xsl:value-of select="$tcID"/></xsl:attribute><xsl:value-of select="$tcID"/> 
					<xsl:if test="pathName != ''">
		 				- <xsl:value-of select="pathName"/>
					</xsl:if>
				</a>
				<span class="subTitle"> (weight: <xsl:value-of select="pathWeight"/>, length: <xsl:value-of select="count(stepList/step)"/>)</span>
			</h2> 
			<div class="testcaseDIV"><xsl:attribute name="id"><xsl:value-of select="$tcID"/></xsl:attribute>
				<div class="index"><a href="#INDEX">Test Case List</a></div> 
					<div class="graph" align="center">
						<xsl:choose>
							<xsl:when test="$LinkGraph = 'Y'"><a><xsl:attribute name='href'><xsl:value-of select="graphFileName"/></xsl:attribute><xsl:value-of select="$tcID"/> Graph</a>
							</xsl:when>
							<xsl:otherwise>
								<img border="0"><xsl:attribute name='src'><xsl:value-of select="graphFileName"/></xsl:attribute></img>
							</xsl:otherwise>
						</xsl:choose>
					</div>
					<h4>Requirements</h4>
			<xsl:variable name="patTagItemList" select="pathTagList/item"/>
			<xsl:variable name="patTagItemCount" select="count($patTagItemList)"/>
			<xsl:if test="$patTagItemCount &lt; 1">
				<p>None</p>
			</xsl:if>
			<xsl:if test="$patTagItemCount &gt; 0">
					<ul class="ulReq">
				<xsl:for-each select="$patTagItemList">
						<xsl:variable name="curTag" select="."/>
				 		<li><span class="tag"><xsl:attribute name="class">p_<xsl:value-of select="//suite/tagPriorityList/tag[tag=$curTag]/priority"/></xsl:attribute><xsl:attribute name="title">Priority <xsl:value-of select="//suite/tagPriorityList/tag[tag=$curTag]/priority"/></xsl:attribute><xsl:value-of select="."/><sup><xsl:value-of select="//suite/tagPriorityList/tag[tag=$curTag]/priority"/></sup></span></li>
			 	</xsl:for-each>
					</ul>
					<br/>
			</xsl:if>
					<h4>Test Setup / Pre-conditions</h4> 
			<xsl:variable name="preConditionItemList" select="preCondition/item"/>
			<xsl:variable name="preConditionItemCount" select="count($preConditionItemList)"/>
			<xsl:if test="$preConditionItemCount &lt; 1">
					<p>None</p>
			</xsl:if>
			<xsl:if test="$preConditionItemCount &gt; 0">
					<ul> 
					<xsl:for-each select="$preConditionItemList">
						<li><xsl:value-of select="message/." disable-output-escaping="yes"/></li>
					</xsl:for-each>
					</ul>
			</xsl:if>
					<table border="1" width="100%" cellpadding="5" cellspacing="0" class="testcase" > 
						<tr class="tableHeader">
							<th class="tlabel" width="2%">Step</th> 
							<th class="tlabel">Action</th> 
							<th class="tlabel">Assert Expected Results 
			<xsl:if test="//fieldList/field[name='UpdateSection']/value='true'">
							(check all: 
								<a href="javascript:void(0);" class="checkAllCase">none</a>
								<a href="javascript:void(0);" class="checkAllCase">passed</a>
								<a href="javascript:void(0);" class="checkAllCase">failed</a>
								<a href="javascript:void(0);" class="checkAllCase">blocked</a>)
			</xsl:if>
							</th> 
						</tr>  
			<xsl:for-each select="stepList/step">
						<tr class="testcaseTR">
							<td valign="top" align="right" class="colNum"><xsl:value-of select="position()"/></td> 
							<td align="left" valign="top" class="colAction">
							<xsl:if test="not (sourceStateID=targetStateID)">
									<b>From:</b>&#160;<xsl:value-of select="sourceStateID"/><br/>
							</xsl:if>
									<b>Do:</b>&#160;<xsl:value-of select="transID"/>
								<ul>
				<xsl:for-each select="prepList/item">
									<li><xsl:value-of select="message/." disable-output-escaping="yes"/></li>
				</xsl:for-each>
				<xsl:for-each select="actionList/item">
					<xsl:choose>
						<xsl:when test="contains(message, '|OsCmd|')">
									<li><a><xsl:attribute name="href">
											<xsl:value-of select="substring-after(message, '|OsCmd|')"/>
										</xsl:attribute>
										<xsl:value-of select="substring-before(message, '|OsCmd|')"/>
									</a></li>
						</xsl:when>
						<xsl:otherwise>
									<li><xsl:value-of select="message/." disable-output-escaping="yes"/></li>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:for-each>
								</ul>
							</td>

							<td valign="top" align="left" class="colVerify">
							<xsl:if test="not (sourceStateID=targetStateID)">
								<b>At:</b>&#160;<xsl:value-of select="targetStateID"/><br/>
							</xsl:if>
								<b>Expected Results:</b>
				<xsl:variable name="verifyItemList" select="verifyList/item"/>
				<xsl:variable name="verifyItemCount" select="count($verifyItemList)"/>
				<xsl:if test="$verifyItemCount &gt; 1">
					<xsl:if test="//fieldList/field[name='UpdateSection']/value='true'">
								 (check all: 
									<a href="javascript:void(0);" class="checkAllStep">none</a>
									<a href="javascript:void(0);" class="checkAllStep">passed</a>
									<a href="javascript:void(0);" class="checkAllStep">failed</a>
									<a href="javascript:void(0);" class="checkAllStep">blocked</a>)
					</xsl:if>
				</xsl:if>
									<br/>
								<ul>
				<xsl:for-each select="$verifyItemList">
									<li class="assertItem">
					<xsl:attribute name="assertid"><xsl:value-of select="assertID"/></xsl:attribute>
					<xsl:value-of select="message/."  disable-output-escaping="yes"/><br/>
					<xsl:variable name="verifyItemTagList" select="tagList/item"/>
					<xsl:variable name="verifyItemTagCount" select="count($verifyItemTagList)"/>
					<xsl:if test="$verifyItemTagCount &gt; 0">
							Requirements: 
					</xsl:if>
					<xsl:for-each select="$verifyItemTagList">
						<xsl:variable name="curTag" select="."/>
								 			<span id="tagListItem"><xsl:attribute name="tag"><xsl:value-of select="."/></xsl:attribute><a><xsl:attribute name='name'><xsl:value-of select="$tcID"/>_<xsl:value-of select="."/></xsl:attribute><span><xsl:attribute name="title">Priority <xsl:value-of select="//suite/tagPriorityList/tag[tag=$curTag]/priority"/></xsl:attribute><xsl:attribute name="class">p_<xsl:value-of select="//suite/tagPriorityList/tag[tag=$curTag]/priority"/></xsl:attribute><span class="tag"><xsl:value-of select="."/></span><sup><xsl:value-of select="//suite/tagPriorityList/tag[tag=$curTag]/priority"/></sup></span>&#160;</a></span>
					</xsl:for-each>

					<xsl:if test="assertID!=''">
						(<xsl:value-of select="assertID"/>)
					</xsl:if>
						<input type="checkbox" class="updDefect" title="indicator if changed and waiting to be saved."></input>
					<xsl:if test="count(tagList/item) &gt; 0">
							<br/>
					</xsl:if>

				<xsl:if test="$showUpdateSection">
					<xsl:if test="type='assert'">
						<xsl:if test="$updateModeSelect">
								 			<select title="select a status for this assert item" class="statusSelect storeField">
											    	<xsl:attribute name="storeID">
											    		<xsl:value-of select="math:random()"/>
											    	</xsl:attribute>

												<option value="none"></option>
												<option value="passed">passed</option>
												<option value="failed">failed</option>
												<option value="blocked">blocked</option>
											</select>
											<textarea style="display:none;" class="failedCmt storeID" cols="40" rows="2">
										    	<xsl:attribute name="storeID">
										    		<xsl:value-of select="math:random()"/>
										    	</xsl:attribute>
											</textarea>
						</xsl:if>
						<xsl:if test="$updateModeRadio">
							<xsl:variable name="radioName" select="math:random()"/>
									 			<input type="radio" value="none" class="statusSelect storeField">
									 				<xsl:attribute name="name"><xsl:value-of select="$radioName"/></xsl:attribute>
			 								    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
									 			</input> <span class="radioLabel">none</span>
									 			<input type="radio" value="passed" class="statusSelect storeField">
									 				<xsl:attribute name="name"><xsl:value-of select="$radioName"/></xsl:attribute>
			 								    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
									 			</input> <span class="radioLabel">passed</span> 
									 			<input type="radio" value="failed" class="statusSelect storeField">
									 				<xsl:attribute name="name"><xsl:value-of select="$radioName"/></xsl:attribute>
			 								    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
									 			</input> <span class="radioLabel">failed</span>
									 			<input type="radio" value="blocked" class="statusSelect storeField">
									 				<xsl:attribute name="name"><xsl:value-of select="$radioName"/></xsl:attribute>
			 								    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
									 			</input> <span class="radioLabel">blocked</span><br/>
									 			<textarea style="display:none;" class="failedCmt storeField" cols="40" rows="2">
			 								    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
									 			</textarea><br/>
						</xsl:if>
						
					</xsl:if>
				</xsl:if>
									</li>
				</xsl:for-each>
				<xsl:for-each select="postConditionList/item">
									<li><xsl:value-of select="message/." disable-output-escaping="yes"/></li>
				</xsl:for-each>
								</ul>
							</td>
						</tr>
			</xsl:for-each>
					</table>
					<h4>Test Teardown / Post-conditions</h4> 
			<xsl:variable name="postConditionItemList" select="postCondition/item"/>
			<xsl:variable name="postConditionItemCount" select="count($postConditionItemList)"/>
			<xsl:if test="$postConditionItemCount &lt; 1">
					<p>None</p>
			</xsl:if>

			<xsl:if test="$postConditionItemCount &gt; 0">
					<ul> 
			<xsl:for-each select="$postConditionItemList">
						<li><xsl:value-of select="message/." disable-output-escaping="yes"/></li>
			</xsl:for-each>
					</ul>
			</xsl:if>
					<table width="98%" style="padding-left: 5px;" border="0" cellpadding="5" cellspacing="0" class="testcaseFooter">
						<tr>
							<td class="tlabel" align="left">
								<b>Tester Name:</b>
							</td>
							<td align="left">
								<input class="testerName storeField" type="text" size="25">
							    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
								</input>
							</td>
							<td class="tlabel" valign="middle" align="right" rowspan="3" width="60%">
								<table border="0" width="100%" height="100%">
									<tr><td valign="top" align="right" width="10%">
											<b>Notes:</b>
										</td>
										<td class="noteArea" align="left" valign="top" width="90%" rowspan="3">
											<textarea class="testerNotes" style="padding:0px; height: 100%; width: 100%;">
		 								    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
											</textarea>
										</td>
									</tr>
									<tr><td align="right">									
											<a class="clearNote"><xsl:attribute name="onclick">javascript:clearTesterNote('<xsl:value-of select="$tcID"/>','');</xsl:attribute>clear</a>
										</td>
									</tr>
									<tr>
										<td align="right">
											<a class="addNote"><xsl:attribute name="onclick">javascript:addTesterNote('<xsl:value-of select="$tcID"/>','');</xsl:attribute>add</a>
										</td>
									</tr>
								</table>
							</td>
						</tr>
						<tr>
							<td class="tlabel" align="left">
								<b>Date:</b>
							</td>
							<td align="left">
								<input class="effort storeField" type="text" size="25">
							    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
								</input>
							</td>
						</tr>
						<tr>
							<td class="tlabel" align="left">
								<b>Effort:</b>
							</td>
							<td align="left">
								<input class="effort storeField" type="text"  size="25">
							    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
								</input>
							</td>
						</tr>
					</table>
<div style="font-size:xx-small;width:100%;"><xsl:value-of select="java:format(java:java.text.SimpleDateFormat.new('mm:ss.ms'), java:java.util.Date.new())"/></div>
				</div>
			<hr />
		</xsl:if>
	</xsl:for-each>

	<xsl:if test="count(mbtEndList/item) &gt; 0">
			<h2 class="postscriptH2" style="margin-top: 1em;"><a name="POSTSCRIPT">POSTSCRIPT</a></h2> 
			<div class="index"><a href="#INDEX">Test Case List</a></div> 
			<div id="POSTSCRIPT" class="testcasedetail" style="horizontal-align: left"> 
				<ul>
		<xsl:for-each select="mbtEndList/item">
					<li><xsl:value-of select="message/." disable-output-escaping="yes"/></li>
		</xsl:for-each>
				</ul>
			</div><!-- End of testcase detail --> 
			<hr />
	</xsl:if>
		</div>
		
		</form>
		<div>
			<table width="100%" style="padding:0px; margin:0px;" border="0" cellpadding="0" cellspacing="0" class="testcaseFooter">
				<tr>
					<td align="left">
					    <input type="button" id="saveBtn" style="display:none;" title="Save this test case report" value="Save" />
					    <input type="button" id="resetBtn" title="Clear all fields" value="Reset" />
						<input type="button" id="printBtn" title="Print this page. Make sure your browser is configured to print background color/images.  You may print to pdf if you have doPDF installed." value="Print"/>
						<input type="button" id="resizeBtn" title="Resize all over sized graphs to fill the width of the current window." value="Resize Images"/>
	   				</td>
	   				<td>
	   					<span id="defectStatus" style="float: right;">
	   						ALM/Defect Status: <span id="savedCount"/> of <span id="defectCount"/> Saved
	   					</span>
	   				</td>
   				</tr>
			</table>
		</div>

		<div id="testerNotesPopup" style="display:none; border:1px solid red;">
			<table border="1" width="100%" height="100%">
				<tr width="100%">
					<th>
						Tester Notes for <span class="tcName"></span>
					</th>
				</tr>	
				<tr>
					<td align="center">
						<textarea type="text" rows="4" cols="40" class="storeField">
					    	<xsl:attribute name="storeID"><xsl:value-of select="math:random()"/></xsl:attribute>
						</textarea>
					</td>
				</tr>
				<tr>
					<th align="center" width="100%">
						<button class="closeBtn">Close</button>
					</th>
				</tr>
			</table>
		</div>
		
		<div id="defectRecordsPopup">
			<table border="0" cellspacing="0">
				<thead>
				<tr class="header">
					<th colspan="7">
						<span>Defect Records Save Status <small>(total defects: <span id="defCnt"></span>)</small>
						</span>
						<span id="almClose">x</span>
					</th>
				</tr>
				<tr width="100%" class="header">
					<th>TestCase</th>
					<th>Step</th>
					<th>Req-Tag</th>
					<th>AssertID</th> 
					<th>ALM-Status</th>
				</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</body> 
</html>
</xsl:template>
</xsl:stylesheet>
