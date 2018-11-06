<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	<xsl:variable name="en" select="document('file:TranscriberUi-enStrings.xml')"/>
	<xsl:variable name="ar" select="document('file:TranscriberUi-arStrings.xml')"/>
	<xsl:variable name="es" select="document('file:TranscriberUi-esStrings.xml')"/>
	<xsl:variable name="fr" select="document('file:TranscriberUi-frStrings.xml')"/>
	<xsl:variable name="ha" select="document('file:TranscriberUi-haStrings.xml')"/>
	<xsl:variable name="id" select="document('file:TranscriberUi-idStrings.xml')"/>
	<xsl:variable name="pt" select="document('file:TranscriberUi-ptStrings.xml')"/>
	<xsl:variable name="ru" select="document('file:TranscriberUi-ruStrings.xml')"/>
	<xsl:variable name="sw" select="document('file:TranscriberUi-swStrings.xml')"/>
	<xsl:variable name="ta" select="document('file:TranscriberUi-taStrings.xml')"/>
	
	<xsl:output indent="yes"/>
	
	<xsl:template match="/">
		<strings>
			<transcriber>
				<xsl:copy-of select="$en//transcriber/en"/>
				<xsl:copy-of select="$ar//transcriber/ar"/>
				<xsl:copy-of select="$es//transcriber/es"/>
				<xsl:copy-of select="$fr//transcriber/fr"/>
				<xsl:copy-of select="$ha//transcriber/ha"/>
				<xsl:copy-of select="$id//transcriber/id"/>
				<xsl:copy-of select="$pt//transcriber/pt"/>
				<xsl:copy-of select="$ru//transcriber/ru"/>
				<xsl:copy-of select="$sw//transcriber/sw"/>
				<xsl:copy-of select="$ta//transcriber/ta"/>
			</transcriber>
			<userSettings>
				<xsl:copy-of select="$en//userSettings/en"/>
				<xsl:copy-of select="$ar//userSettings/ar"/>
				<xsl:copy-of select="$es//userSettings/es"/>
				<xsl:copy-of select="$fr//userSettings/fr"/>
				<xsl:copy-of select="$ha//userSettings/ha"/>
				<xsl:copy-of select="$id//userSettings/id"/>
				<xsl:copy-of select="$pt//userSettings/pt"/>
				<xsl:copy-of select="$ru//userSettings/ru"/>
				<xsl:copy-of select="$sw//userSettings/sw"/>
				<xsl:copy-of select="$ta//userSettings/ta"/>
			</userSettings>
			<projectSettings>
				<xsl:copy-of select="$en//projectSettings/en"/>
				<xsl:copy-of select="$ar//projectSettings/ar"/>
				<xsl:copy-of select="$es//projectSettings/es"/>
				<xsl:copy-of select="$fr//projectSettings/fr"/>
				<xsl:copy-of select="$ha//projectSettings/ha"/>
				<xsl:copy-of select="$id//projectSettings/id"/>
				<xsl:copy-of select="$pt//projectSettings/pt"/>
				<xsl:copy-of select="$ru//projectSettings/ru"/>
				<xsl:copy-of select="$sw//projectSettings/sw"/>
				<xsl:copy-of select="$ta//projectSettings/ta"/>
			</projectSettings>
		</strings>
	</xsl:template>
</xsl:stylesheet>