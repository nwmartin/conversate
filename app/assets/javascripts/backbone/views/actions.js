Structural.Views.Actions = Support.CompositeView.extend({
  className: 'act-list',
  initialize: function(options) {
    this.collection.on('add', this.renderAction, this);
    this.collection.on('reset', this.reRender, this);
  },
  render: function() {
    this.collection.forEach(this.renderAction, this);
    this.scrollDownAtEarliestOpportunity();
    return this;
  },
  renderAction: function(action) {
    var view = new Structural.Views.Action({model: action});
    this.appendChild(view);
  },
  reRender: function() {
    this.children.each(function(view) {
      view.leave();
    })
    this.$el.empty();
    this.render();
  },

  // Sometimes when we want to scroll down the actions list hasn't actually been
  // added to the DOM yet, and you can't scroll things that aren't in the DOM.
  scrollDownAtEarliestOpportunity: function() {
    var self = this;
    var scrollUnlessAtBottom = function() {
      if (self.isAtBottom()) {
        clearInterval(self._scrollerIntervalId);
      } else {
        self.scrollToBottom();
      }
    };
    scrollUnlessAtBottom();
    this._scrollerIntervalId = setInterval(scrollUnlessAtBottom, 300);
  }
});

_.extend(Structural.Views.Actions.prototype, Support.Scroller);
