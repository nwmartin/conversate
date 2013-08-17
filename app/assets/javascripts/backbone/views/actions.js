Structural.Views.Actions = Support.CompositeView.extend({
  className: 'act-list',
  initialize: function(options) {
    this.collection.on('add', this.renderAction, this);
    this.collection.on('reset', this.reRender, this);
  },
  render: function() {
    this.collection.forEach(this.renderAction, this);
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
  changeConversation: function(actions) {
    this.collection.off(null, null, this);
    this.collection = actions;
    this.collection.on('add', this.renderAction, this);
    this.collection.on('reset', this.reRender, this);
    this.reRender();
  }
});
