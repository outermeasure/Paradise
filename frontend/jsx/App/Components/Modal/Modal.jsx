var React = require('react');
var ReactDOM = require('react-dom');
var PropTypes = require('prop-types');
var ExecutionEnvironment = require('exenv');
var ModalPortal = React.createFactory(require('react-modal/lib/components/ModalPortal'));
var ariaAppHider = require('react-modal/lib/helpers/ariaAppHider');
var refCount = require('react-modal/lib/helpers/refCount');
var elementClass = require('element-class');
var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
var Assign = require('lodash.assign');
var createReactClass = require('create-react-class')

var SafeHTMLElement = ExecutionEnvironment.canUseDOM ? window.HTMLElement : {};
var AppElement = ExecutionEnvironment.canUseDOM ? document.body : {appendChild: function() {}};

function getParentElement(parentSelector) {
	return parentSelector();
}

var Modal = createReactClass({

	displayName: 'Modal',
	statics: {
		setAppElement: function(element) {
			AppElement = ariaAppHider.setElement(element);
		},
		injectCSS: function() {
			"production" !== process.env.NODE_ENV
			&& console.warn('React-Modal: injectCSS has been deprecated ' +
				'and no longer has any effect. It will be removed in a later version');
		}
	},

	propTypes: {
		isOpen: PropTypes.bool.isRequired,
		style: PropTypes.shape({
			content: PropTypes.object,
			overlay: PropTypes.object
		}),
		portalClassName: PropTypes.string,
		appElement: PropTypes.instanceOf(SafeHTMLElement),
		onAfterOpen: PropTypes.func,
		onRequestClose: PropTypes.func,
		closeTimeoutMS: PropTypes.number,
		ariaHideApp: PropTypes.bool,
		shouldCloseOnOverlayClick: PropTypes.bool,
		parentSelector: PropTypes.func,
		role: PropTypes.string,
		contentLabel: PropTypes.string.isRequired
	},

	getDefaultProps: function () {
		return {
			isOpen: false,
			portalClassName: 'ReactModalPortal',
			ariaHideApp: true,
			closeTimeoutMS: 0,
			shouldCloseOnOverlayClick: true,
			parentSelector: function () { return document.body; }
		};
	},

	componentDidMount: function() {
		window.SCROLL_TOP_WORKAROUND = null;
		this.node = document.createElement('div');
		this.node.className = this.props.portalClassName;

		if (this.props.isOpen) refCount.add(this);

		var parent = getParentElement(this.props.parentSelector);
		parent.appendChild(this.node);
		this.renderPortal(this.props);
	},

	componentWillReceiveProps: function(newProps) {
		if (newProps.isOpen) refCount.add(this);
		if (!newProps.isOpen) refCount.remove(this);
		var currentParent = getParentElement(this.props.parentSelector);
		var newParent = getParentElement(newProps.parentSelector);

		if(newParent !== currentParent) {
			currentParent.removeChild(this.node);
			newParent.appendChild(this.node);
		}

		this.renderPortal(newProps);
	},

	componentWillUnmount: function() {
		refCount.remove(this);

		if (this.props.ariaHideApp) {
			ariaAppHider.show(this.props.appElement);
		}

		var state = this.portal.state;
		var now = Date.now();
		var closesAt = state.isOpen && this.props.closeTimeoutMS
			&& (state.closesAt
			|| now + this.props.closeTimeoutMS);

		if (closesAt) {
			if (!state.beforeClose) {
				this.portal.closeWithTimeout();
			}

			var that = this;
			setTimeout(function() { that.removePortal(); }, closesAt - now);
		} else {
			this.removePortal();
		}
	},

	removePortal: function() {
		ReactDOM.unmountComponentAtNode(this.node);
		var parent = getParentElement(this.props.parentSelector);
		parent.removeChild(this.node);
		if (refCount.count() === 0) {
			document.getElementById("paradise").removeAttribute("style");
			elementClass(document.body).remove('ReactModal__Body--open');

			window.scrollTo(
				(document.documentElement &&
				document.documentElement.scrollLeft) ||
				document.body.scrollLeft,
				window.SCROLL_TOP_WORKAROUND
			);
		}
	},

	renderPortal: function(props) {
		if (props.isOpen || refCount.count() > 0) {
			window.SCROLL_TOP_WORKAROUND = (document.documentElement &&
				document.documentElement.scrollTop) ||
				document.body.scrollTop;

			if (!document.getElementById("paradise").getAttribute("style")) {
				document.getElementById("paradise").setAttribute(
					"style",
					`position: fixed; top: -${
						window.SCROLL_TOP_WORKAROUND}px; left: 0; right: 0;`
				);
			}
			elementClass(document.body).add('ReactModal__Body--open');
		} else {
			document.getElementById("paradise").removeAttribute("style");
			elementClass(document.body).remove('ReactModal__Body--open');

			if (window.SCROLL_TOP_WORKAROUND !== null) {
				window.scrollTo(
					(document.documentElement &&
					document.documentElement.scrollLeft) ||
					document.body.scrollLeft,
					window.SCROLL_TOP_WORKAROUND
				);

				window.SCROLL_TOP_WORKAROUND = null;
			}	
		}

		if (props.ariaHideApp) {
			ariaAppHider.toggle(props.isOpen, props.appElement);
		}

		this.portal = renderSubtreeIntoContainer(this, ModalPortal(Assign({}, props, {defaultStyles: Modal.defaultStyles})), this.node);
	},

	render: function () {
		return React.DOM.noscript();
	}
});

Modal.defaultStyles = {
	overlay: {},
	content: {}
}

module.exports = Modal
