// These are all the regular expressions used to detect web font
// services. Where possible, it only uses the sub-domain from
// which fonts are served, but this isn't always possible.
module.exports = {

  // Google's service has moved domains a couple times over
  // the past years.
  GOOGLE_FONTS: '(fonts\\.(gstatic|googleapis)\\.com)|(themes\.googleusercontent\.com\/static\/fonts)|(ssl\.gstatic\.com\/fonts\/)',

  // Adobe Fonts (Typekit) primarily uses use.typekit.net (or .com), but
  // temporarily used fonts.typekit.net.
  //
  // Adobe Fonts also operates a semi-self hosted webfont services
  // for enterprise customers (i.e. a custom DNS entry or CDN pointing
  // to Adobe's servers,) but I consider these self-hosted.
  TYPEKIT: '(use|fonts)\\.typekit\\.(net|com)',

  // Edge Web Fonts are served from two different domains, one
  // for public users (edgefonts.net) and another for websites
  // published through Adobe's tools (webfonts.creativecloud.com).
  EDGE_WEB_FONTS: '(use\\.edgefonts\\.net|webfonts\\.creativecloud\\.com)',

  // Fonts.com serves both their hosted service and their "self-hosted"
  // fonts from fast.fonts.net. For the self-hosted fonts, a tracker
  // to fast.fonts.net is added. We explicitly only count the hosted
  // service.
  FONTS_COM: 'fast\\.fonts\\.(com|net)\\/(jsapi|cssapi)',

  FONTDECK: 'f\\.fontdeck\\.com',

  WEBTYPE: 'cloud\\.webtype\\.com',

  TYPE_NETWORK: 'cloud\\.typenetwork\\.com',

  CLOUD_TYPOGRAPHY: 'cloud\\.typography\\.com',

  WEBINK: 'fnt\\.webink\\.com',

  TYPOTHEQUE: 'fonts\\.typotheque\\.com',

  FONTSTAND: 'webfonts\\.fontstand\\.com',

  TYPE_SQUARE: 'typesquare\\.com',

  // Font Plus seems to host all its web fonts from this domain,
  // but it is hard to tell what is going on. Needs more investigation.
  FONT_PLUS: 'webfont\\.fontplus\\.jp',

  // Fontawesome is served from many CDNs, but only the Fontawesome
  // CDN is meant exclusively as a "webfont service", so we only
  // count inclusions from its domain.
  FONTAWESOME: 'fontawesome\\.com',

  FONTSLIVE: 'webfonts\\.fontslive\\.com',

  JUST_ANOTHER_FOUNDRY: 'webfonts\\.justanotherfoundry\\.com',

  TYPONINE: 'fonts\\.typonine\\.com',

  KERNEST: 'kernest\\.com',

  TYPEFRONT: 'typefront\\.com'
};
