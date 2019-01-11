const DOMAIN = 'arm-system-holdings.com';

export const environment = {
  production: false,
  DOMAIN: DOMAIN,
	API_DOMAIN: `https://stg-api.${DOMAIN}`,
	API_SERVER: `https://stg-api.${DOMAIN}`,
	URI_SERVER: `https://stg.${DOMAIN}`,
	API_SERVER_VERSION: 'v2',
	ENABLE_CAPTCHA: 1,
	// CAPTCHA_SITE_KEY: '6LcpcmkUAAAAAEbiUTv5otsMXyWbp1rFabdG0eCK', -> root
	// CAPTCHA_SECRET_KEY: '6LcpcmkUAAAAAEna-F1bDTXMVqDEL6DHso6L3zze', -> root
	CAPTCHA_SITE_KEY: '6LcM_HEUAAAAAGMEQKtmm1YHL4uUojorhZSU5WEd',
	CAPTCHA_SECRET_KEY: '6LcM_HEUAAAAAP4cg32tWzlq4SuP4XxljOj1FscK',
	HC_SERVER: 'http://stg-hc.arm-system-holdings.com',
	HEALTH_CHECK_ENABLED: 0,
};
