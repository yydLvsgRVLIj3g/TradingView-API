const axios = require('axios');
const { genAuthCookies } = require('../utils');

// Constants for drawing configuration
const DRAWING_TYPES = {
  TREND_LINE: 'LineToolTrendLine',
  RECTANGLE: 'LineToolRectangle',
};

const DEFAULT_STYLES = {
  TREND_LINE: {
    linecolor: 'rgba(242, 54, 69, 1)',
    linewidth: 1,
    linestyle: 0,
    extendLeft: false,
    extendRight: false,
    leftEnd: 0,
    rightEnd: 0,
    showLabel: true,
    horzLabelsAlign: 'left',
    vertLabelsAlign: 'middle',
    textcolor: 'rgba(255, 235, 59, 1)',
    fontsize: 16,
    bold: false,
    italic: false,
    alwaysShowStats: true,
    showMiddlePoint: true,
    showPriceLabels: true,
    showPriceRange: false,
    showPercentPriceRange: false,
    showPipsPriceRange: false,
    showBarsRange: false,
    showDateTimeRange: false,
    showDistance: false,
    showAngle: false,
    statsPosition: 3,
    snapTo45Degrees: true,
    fixedSize: true,
    symbolStateVersion: 2,
    zOrderVersion: 2,
    visible: true,
    frozen: false,
    text: '',
    title: '',
  },
  RECTANGLE: {
    color: 'rgba(8, 153, 129, 1)',
    fillBackground: true,
    backgroundColor: 'rgba(248, 187, 208, 0.1939)',
    linewidth: 1,
    transparency: 50,
    showLabel: true,
    horzLabelsAlign: 'center',
    vertLabelsAlign: 'top',
    textColor: 'rgba(255, 235, 59, 1)',
    fontSize: 18,
    bold: false,
    italic: false,
    extendLeft: false,
    extendRight: false,
    middleLine: {
      showLine: true,
      lineWidth: 1,
      lineColor: '#9c27b0',
      lineStyle: 2,
    },
    linestyle: 0,
    symbolStateVersion: 2,
    zOrderVersion: 2,
    frozen: false,
    visible: true,
    text: '',
    title: '',
  },
};

const Z_ORDER = {
  TREND_LINE: -625,
  RECTANGLE: -313,
};

const API_CONFIG = {
  BASE_URL: 'https://charts-storage.tradingview.com/charts-storage',
  TOKEN_URL: 'https://www.tradingview.com/chart-token',
  DEFAULT_CHART_ID: '_shared',
  HEADERS: {
    'accept': '*/*',
    'accept-language': 'zh-CN,zh;q=0.9,ru;q=0.8,en;q=0.7',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'origin': 'https://www.tradingview.com',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://www.tradingview.com/',
    'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    'x-build-time': '2025-06-05T12:39:01',
  },
};

/**
 * @typedef {Object} DrawingPoint
 * @prop {number} time_t Point X time position
 * @prop {number} offset Point offset
 * @prop {number} price Point Y price position
 * @prop {string} interval Point interval
 */

/**
 * @typedef {Object} DrawingState
 * @prop {string} type Drawing type (e.g., 'LineToolTrendLine')
 * @prop {string} id Drawing ID
 * @prop {Object} state Drawing state configuration
 * @prop {string} state.linecolor Line color in rgba format
 * @prop {number} state.linewidth Line width
 * @prop {number} state.linestyle Line style (0=solid, 1=dotted, 2=dashed)
 * @prop {boolean} state.extendLeft Extend line to left
 * @prop {boolean} state.extendRight Extend line to right
 * @prop {boolean} state.showLabel Show label
 * @prop {string} state.textcolor Text color in rgba format
 * @prop {number} state.fontsize Font size
 * @prop {boolean} state.bold Bold text
 * @prop {boolean} state.italic Italic text
 * @prop {string} state.text Text content
 * @prop {string} state.title Title content
 * @prop {string} interval Drawing interval
 * @prop {DrawingPoint[]} points Array of drawing points
 * @prop {number} zorder Z-order for layering
 * @prop {string} ownerSource Owner source
 * @prop {string} linkKey Link key for sharing
 * @prop {number} sharingMode Sharing mode
 * @prop {string} symbol Market symbol
 * @prop {string} currencyId Currency ID
 * @prop {string} unitId Unit ID
 */

/**
 * @typedef {Object} DrawingSources
 * @prop {Object<string, DrawingState>} sources Drawing sources object
 * @prop {Object} drawing_groups Drawing groups
 * @prop {string} clientId Client ID
 */

/**
 * @typedef {Object} UserCredentials
 * @prop {string} [session] Session ID
 * @prop {string} [signature] Session signature
 * @prop {number} [id] User ID
 */

/**
 * Class for managing TradingView chart drawings
 */
class ChartDrawings {
  /**
   * @param {UserCredentials} credentials User credentials
   */
  constructor(credentials = {}) {
    this.credentials = credentials;
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Validate drawing options
   * @param {Object} options Drawing options
   * @param {number} expectedPoints Expected number of points
   * @private
   */
  _validateDrawingOptions(options, expectedPoints) {
    if (!options.id) {
      throw new Error('Drawing ID is required');
    }
    if (!options.symbol) {
      throw new Error('Symbol is required');
    }
    if (!options.points || options.points.length !== expectedPoints) {
      throw new Error(`Exactly ${expectedPoints} points are required`);
    }
  }

  /**
   * Create base drawing state
   * @param {Object} options Drawing options
   * @param {string} type Drawing type
   * @param {Object} defaultStyle Default style configuration
   * @param {number} zOrder Z-order value
   * @returns {DrawingState} Base drawing state
   * @private
   */
  _createBaseDrawingState(options, type, defaultStyle, zOrder) {
    const style = { ...defaultStyle, ...options.style };
    
    // Handle nested style objects
    if (options.style && options.style.middleLine && defaultStyle.middleLine) {
      style.middleLine = { ...defaultStyle.middleLine, ...options.style.middleLine };
    }

    const baseState = {
      ...style,
      symbol: options.symbol,
      currencyId: null,
      unitId: null,
      interval: options.points[0].interval || '5',
      lastUpdateTime: Date.now(),
      adjustedToSplitTime: Date.now() / 1000,
    };

    // Add specific configurations for trend lines
    if (type === DRAWING_TYPES.TREND_LINE) {
      baseState.intervalsVisibilities = {
        seconds: false,
        daysTo: 5,
        months: false,
      };
    }

    return {
      id: options.id,
      ownerSource: '_seriesId',
      state: {
        type,
        id: options.id,
        state: baseState,
        points: options.points,
        zorder: zOrder,
        ownerSource: '_seriesId',
        linkKey: this.generateLinkKey(),
        sharingMode: 1,
      },
      symbol: options.symbol,
      currencyId: null,
      unitId: null,
    };
  }

  /**
   * Create request headers with authentication
   * @returns {Object} Request headers
   * @private
   */
  _createHeaders() {
    const headers = { ...API_CONFIG.HEADERS };
    
    if (this.credentials.session) {
      headers.cookie = genAuthCookies(this.credentials.session, this.credentials.signature);
    }
    
    return headers;
  }

  /**
   * Get JWT token for chart access
   * @param {string} layoutId Layout ID
   * @returns {Promise<string>} JWT token
   */
  async getJWTToken(layoutId) {
    if (!this.credentials.session) {
      throw new Error('Session credentials required for JWT token');
    }

    try {
      const response = await axios.get(API_CONFIG.TOKEN_URL, {
        headers: {
          cookie: genAuthCookies(this.credentials.session, this.credentials.signature),
          'User-Agent': API_CONFIG.HEADERS['user-agent'],
        },
        params: {
          image_url: layoutId,
          user_id: this.credentials.id || -1,
        },
      });

      if (!response.data.token) {
        throw new Error('Failed to get JWT token');
      }

      return response.data.token;
    } catch (error) {
      throw new Error(`Failed to get JWT token: ${error.message}`);
    }
  }

  /**
   * Save drawings to TradingView layout
   * @param {string} layoutId Layout ID
   * @param {DrawingSources} drawingData Drawing sources data
   * @param {string} chartId Chart ID (default: '_shared')
   * @returns {Promise<Object>} API response
   */
  async saveDrawings(layoutId, drawingData, chartId = API_CONFIG.DEFAULT_CHART_ID) {
    if (!layoutId) {
      throw new Error('Layout ID is required');
    }

    if (!drawingData || !drawingData.sources) {
      throw new Error('Drawing data with sources is required');
    }

    try {
      const jwt = await this.getJWTToken(layoutId);
      const url = `${this.baseURL}/layout/${layoutId}/sources`;
      const headers = this._createHeaders();
      
      const params = {
        chart_id: chartId,
        layout_id: layoutId,
        jwt: jwt,
      };

      const response = await axios.put(url, drawingData, {
        headers,
        params,
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Get drawings from TradingView layout
   * @param {string} layoutId Layout ID
   * @param {string} chartId Chart ID (default: '_shared')
   * @param {string} symbol Symbol filter (optional)
   * @returns {Promise<Object>} Drawing sources
   */
  async getDrawings(layoutId, chartId = API_CONFIG.DEFAULT_CHART_ID, symbol = '') {
    if (!layoutId) {
      throw new Error('Layout ID is required');
    }

    try {
      const jwt = await this.getJWTToken(layoutId);
      const url = `${this.baseURL}/get/layout/${layoutId}/sources`;
      
      const params = {
        chart_id: chartId,
        jwt: jwt,
      };

      if (symbol) {
        params.symbol = symbol;
      }

      const response = await axios.get(url, { params });

      if (!response.data.payload) {
        throw new Error('No drawing data found');
      }

      return response.data.payload;
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error ${error.response.status}: ${error.response.statusText}`);
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Create a trend line drawing
   * @param {Object} options Trend line options
   * @param {string} options.id Drawing ID
   * @param {string} options.symbol Market symbol
   * @param {DrawingPoint[]} options.points Array of two points
   * @param {Object} [options.style] Style configuration
   * @returns {DrawingState} Trend line drawing state
   */
  createTrendLine(options) {
    this._validateDrawingOptions(options, 2);
    
    return this._createBaseDrawingState(
      options,
      DRAWING_TYPES.TREND_LINE,
      DEFAULT_STYLES.TREND_LINE,
      Z_ORDER.TREND_LINE
    );
  }

  /**
   * Create a rectangle drawing
   * @param {Object} options Rectangle options
   * @param {string} options.id Drawing ID
   * @param {string} options.symbol Market symbol
   * @param {DrawingPoint[]} options.points Array of two points (top-left and bottom-right)
   * @param {Object} [options.style] Style configuration
   * @returns {DrawingState} Rectangle drawing state
   */
  createRectangle(options) {
    this._validateDrawingOptions(options, 2);
    
    return this._createBaseDrawingState(
      options,
      DRAWING_TYPES.RECTANGLE,
      DEFAULT_STYLES.RECTANGLE,
      Z_ORDER.RECTANGLE
    );
  }

  /**
   * Generate a random link key
   * @returns {string} Random link key
   */
  generateLinkKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 15; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a random drawing ID
   * @returns {string} Random drawing ID
   */
  generateDrawingId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate a random client ID
   * @returns {string} Random client ID
   */
  generateClientId() {
    return `${this.generateDrawingId()}/${Math.floor(Math.random() * 10)}/${this.generateDrawingId()}`;
  }
}

module.exports = ChartDrawings;
