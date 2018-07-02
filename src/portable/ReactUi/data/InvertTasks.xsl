<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	
	<xsl:output indent="yes"/>
	
	<xsl:template match="node()|@*">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
	
	<xsl:template match="*[local-name() = 'project']">
		<xsl:apply-templates select="*"/>
	</xsl:template>
	
	<xsl:template match="*[local-name() = 'task']">
		<xsl:copy>
			<xsl:apply-templates select="@*"/>
			<xsl:element name="project">
				<xsl:apply-templates select="parent::*/@*"/>
			</xsl:element>
			<xsl:apply-templates select="*"/>
		</xsl:copy>
	</xsl:template>
	
</xsl:stylesheet>