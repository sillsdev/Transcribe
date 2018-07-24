<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	version="1.0">
	
	<xsl:output indent="yes"/>
	
	<xsl:template match="/">
		<strings>
			<transcriber>
				<xsl:element name="{/*/@trgLang}">
					<xsl:apply-templates select="//*[local-name()='unit' and starts-with(@id, 'transcribe.')]"/>
				</xsl:element>
			</transcriber>
			<userSettings>
				<xsl:element name="{/*/@trgLang}">
					<xsl:apply-templates select="//*[local-name()='unit' and starts-with(@id, 'userSettings.')]"/>
				</xsl:element>
			</userSettings>
		</strings>
	</xsl:template>
	
	<xsl:template match="*[local-name()= 'unit']">
		<xsl:element name="{substring-after(@id, '.')}">
			<xsl:value-of select=".//*[local-name() = 'target']"/>
		</xsl:element>
	</xsl:template>
</xsl:stylesheet>