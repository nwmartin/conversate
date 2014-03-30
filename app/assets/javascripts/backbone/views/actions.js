Structural.Views.Actions = Support.CompositeView.extend({
  className: 'act-list ui-scrollable',
  initialize: function(options) {
    this._wireEvents(this.collection);

    Structural.on('changeConversation', this.changeConversation, this);
    Structural.on('clearConversation', this.clearConversation, this);

  },
  _wireEvents: function(collection) {
    collection.on('add', this.renderAction, this);
    collection.on('reset', this.reRender, this);
    collection.on('addedSomeoneElsesMessage', this.scrollDownIfAtBottom, this);
    collection.on('actionsLoadedForFirstTime', this.reRender, this);
    collection.on('focusedView', this.scrollToTargetAtEarliestOpportunity, this);
  },
  render: function() {
    this.focusedView = undefined;
    this.collection.forEach(this.renderActionAlwaysAppend, this);
    this.scrollToTargetAtEarliestOpportunity(this.focusedView);
    return this;
  },
  _makeNewActionView: function(action) {
    var view = new Structural.Views.Action({model: action});
    if (view.focused()) {
      this.focusedView = view;
    }
    return view;
  },
  renderAction: function(action) {
    var view = this._makeNewActionView(action)

    var index = this.collection.indexOf(action);
    var prevView = undefined;

    // In order to maintain the right follow on ordering, we need to insert
    // an action after the action most closely previous to it that has a view.

    if (index > 0) {
      for (var modelIndex = index - 1; modelIndex >= 0; modelIndex--) {
        var model = this.collection.at(modelIndex);
        if (this.childrenByModelClientId[model.cid]) {
          prevView = this.childrenByModelClientId[model.cid];
          break;
        }
      }
    }

    if (prevView) {
      this.insertChildAfter(view, prevView.el);
    } else {
      this.appendChild(view);
    }
  },
  renderActionAlwaysAppend: function(action) {
    var view = this._makeNewActionView(action);
    this.appendChild(view);
  },
  reRender: function() {
    this.clearView();
    this.render();
  },
  clearView: function() {
    this.children.each(function(view) {
      view.leave();
    })
    this.$el.empty();
  },
  changeConversation: function(conversation) {
    this.collection.off(null, null, this);
    this.collection = conversation.actions;

    if (!Structural.Router.isActionFocused()) {
      this.collection.clearFocus();
    }

    this._wireEvents(this.collection);
    this.reRender();
  },
  clearConversation: function() {
    this.collection.off(null, null, this);
    this.clearView();
  },

  // Sometimes when we want to scroll down the actions list hasn't actually been
  // added to the DOM yet, and you can't scroll things that aren't in the DOM.
  scrollToTargetAtEarliestOpportunity: function(focusedView) {
    var self = this;
    var scrollUnlessAtTarget = function() {
      if (self.targetIsOnScreen(focusedView)) {
        clearInterval(self._scrollerIntervalId);
      } else {
        self.scrollTargetOnScreen(focusedView);
      }
    };
    scrollUnlessAtTarget();

    if (this._scrollerIntervalId) {
      clearInterval(this._scrollerIntervalId);
    }
    this._scrollerIntervalId = setInterval(scrollUnlessAtTarget, 300);
  },
  scrollDownIfAtBottom: function() {
    if (this.isAtBottom()) {
      this.scrollToTargetAtEarliestOpportunity();
    }
  }
});

_.extend(Structural.Views.Actions.prototype, Support.Scroller);
