Structural.Views.ConversationContainer = Support.CompositeView.extend({
  className: 'cnv-container',
  initialize: function(options) {
    options = options || {};
    this.conversations = options.conversations;
    this.user = options.user;
  },
  render: function() {
    var toolbar = new Structural.Views.ConversationToolbar();
    var list = new Structural.Views.Conversations({
      collection: this.conversations,
      user: this.user
    });

    this.appendChild(toolbar);
    this.appendChild(list);
  }
});
