<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	<xsl:variable name="en" select="document('file:TranscriberUi-enStrings.xml')"/>
	<xsl:variable name="fr" select="document('file:TranscriberUi-frStrings.xml')"/>
	
	<xsl:output indent="yes"/>
	
	<xsl:template match="/">
		<strings>
			<transcriber>
					<xsl:copy-of select="$en//transcriber/en"/>
					<xsl:copy-of select="$fr//transcriber/fr"/>
			</transcriber>
			<userSettings>
					<xsl:copy-of select="$en//userSettings/en"/>
					<xsl:copy-of select="$fr//userSettings/fr"/>
			</userSettings>
		</strings>
	</xsl:template>
</xsl:stylesheet>