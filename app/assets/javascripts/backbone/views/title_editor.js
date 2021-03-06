Structural.Views.TitleEditor = Support.CompositeView.extend({
  className: 'btn-toolbar act-title',
  template: JST.template('actions/title_editor'),
  initialize: function(options) {
    options = options || {};
    this.conversation = options.conversation;
    this.folders = options.folders;
    this.listenTo(Structural, 'changeConversation', this.changeConversation, this);
    this.listenTo(Structural, 'clearConversation', this.clearConversation, this);
    this.listenTo(Structural, 'clickAnywhere', this.saveAndHideAnywhere, this);
    this.conversation.on('archived', this.reRender, this);
  },
  render: function() {
    this.$el.html(this.template({conversation: this.conversation}));
    this._updateFoldersDialog = new Structural.Views.UpdateFoldersDialog({
      folders: this.folders,
      conversation: this.conversation
    });
    this.appendChild(this._updateFoldersDialog);
    this._input = this.$('input[type="text"]');
    return this;
  },
  reRender: function() {
    this.children.forEach(function(child) {
      child.leave();
      child = null;
    });
    this.render();
  },
  events: {
    'click .act-move-cnv': 'toggleUpdateFoldersDialog',
    'click .act-title-edit': 'toggleTitleEditor',
    'click .act-title-editor-popover .popover-close': 'toggleTitleEditor',
    'click .act-title-save': 'saveAndHide',
    'click .act-archive-cnv': 'archiveConversation',
    'click .act-pin-cnv': 'pinConversation'
  },
  archiveConversation: function(e) {
    e.preventDefault();
    this.conversation.toggleArchive();
    this.render();
  },
  pinConversation: function(e) {
    e.preventDefault();
    this.conversation.togglePin();
    this.render();
  },
  retitleConversation: function() {
    // TODO: Figure out what the actual deal with isOpen being false is about.
    // This is just some defensive programming to short circuit some nastiness.
    if (this.$('input').val()) {
      var title = this.$('input').val().trim();

      if (title !== this.conversation.get('title').trim()) {
        this.conversation.changeTitle(title);
        this.trigger('change_title', title);
      }
    }

  },
  toggleUpdateFoldersDialog: function(e) {
    e.preventDefault();
    this._updateFoldersDialog.toggleVisible();
  },
  toggleTitleEditor: function(e) {
    e.preventDefault();
    // TODO: Really move the title editor out into its own view? The current span wrapping makes it a little
    // tricky...
    this.$('.act-title-editor-popover').toggleClass('hidden');
    this.$('.act-title-editor-toggle').toggleClass('active');
  },
  isOpen: function() {
    return !this.$('.act-title-editor-popover').hasClass('hidden');
  },
  saveAndHideAnywhere: function(e) {
    var target = $(e.target);
    if (target.closest('.act-title-editor-wrap').length === 0 && this.isOpen()) {
      this.retitleConversation();
      this.toggleTitleEditor(e);
    }
  },
  saveAndHide: function(e) {
    this.retitleConversation();
    this.toggleTitleEditor(e);
  },
  changeConversation: function(conversation) {
    this.conversation = conversation;
    this.$el.empty();
    this.render();
  },
  clearConversation: function() {
    this.conversation = undefined;
    this.render()
  }
});
