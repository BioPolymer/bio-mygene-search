import { PolymerElement, html } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-button/paper-button";
import "@polymer/iron-ajax/iron-ajax";

/**
 * `bio-mygene-search`
 *
 * @customElement
 * @polymer
 * @demo
 *
 */
class BioMygeneSearch extends PolymerElement {
  static get properties() {
    return {
      /**
       * A comma-delimited list of fields to be returned.
       * @attribute fields
       * @type string
       * @default 'all'
       */
      fields: {
        type: String,
        value: "all"
      },

      /** The gene symbol. */
      symbolValue: {
        type: String,
        notify: true
      },

      params: {
        type: Object,
        value: null
      },

      /** The response. */
      response: {
        type: Object,
        notify: true,
        observer: "responseChanged"
      }
    };
  }

  static get template() {
    return html`
      <style>
        paper-button {
          background-color: #2f466f;
          color: white;
          border-radius: 5px;
          width: 80px;
          padding-left: 20px;
          padding-right: 20px;
          padding-top: 5px;
          padding-bottom: 5px;
        }
      </style>

      <template>
        <paper-input
          id="symbolFld"
          label="Enter a gene symbol"
          floatinglabel="true"
          value="{{symbolValue}}"
          on-change="handleSearch"
        ></paper-input>
        <paper-button on-tap="handleSearch" raised="">Search</paper-button>
        <iron-ajax
          id="ajax"
          url="https://mygene.info/v3/query"
          handleas="json"
          on-response="handleResponse"
          on-core-error="{{handleError}}"
        >
        </iron-ajax>
      </template>
    `;
  }

  /**
   * Instance of the element is created/upgraded. Use: initializing state,
   * set up event listeners, create shadow dom.
   * @constructor
   */
  constructor() {
    super();
  }

  /**
   * Use for one-time configuration of your component after local
   * DOM is initialized.
   */
  ready() {
    super.ready();
  }
  /**
   * This method is responsible for handling the search.
   * @memberof BioMygeneSearch
   */
  handleSearch() {
    var newSymbol = this.symbolValue;

    if (newSymbol != null && newSymbol != "") {
      var symbolParam = "symbol:" + newSymbol;

      var params =
        this.params != null
          ? this.params
          : { q: symbolParam, fields: this.fields };
      this.$.ajax.params = params;
      this.$.ajax.generateRequest();
    }
  }

  /**
   * This method is responsible for handling the response from the search engine.
   */
  handleResponse(response) {
    this.dispatchEvent(
      new CustomEvent("modelChanged", {
        bubbles: true,
        composed: true,
        detail: {
          model: response.detail.response.hits
        }
      })
    );
  }

  /**
   * This method handles any errors received from the server.
   */
  handleError() {
    console.log("error " + this.ajax.error);
  }

  focus() {
    this.$.symbolFld.focus();
  }
}

customElements.define("bio-mygene-search", BioMygeneSearch);
