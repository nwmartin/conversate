Structural.Views.AddInviteDialog = Support.CompositeView.extend({
  className: 'contacts-add-invite-wrap popover-wrap',
  template: JST.template('people/contacts/add_invite_dialog'),
  initialize: function() {
    Structural.on('clickAnywhere', this.closeOnClickOff, this);
    this.showInviteInsteadOfOptions = false;
  },
  render: function() {
    this.$el.html(this.template({}));

    // Structural._user.addressBook() doesn't exist during initialize(), so
    // we have to create the autocomplete here.
    if (!this.autocomplete) {
      this.autocomplete = new Structural.Views.Autocomplete({
        dictionary: Structural._user.addressBook(),
        blacklist: new Structural.Collections.Participants([]),
        addSelectionToBlacklist: false,
        property: 'name',
        inputContainer: this.$('.contact-input'),
        optionsContainer: this.$('.contacts-list')
      });
      this.autocomplete.on('optionsUpdated', this.showInviteOnNoOptions, this);
      this.autocomplete.on('select', this.addExistingUser, this);
    }

    this.appendChild(this.autocomplete);
    this.showHideInviteContacts();

    return this;
  },
  events: {
    'click .contacts-add-invite': 'toggleAddInvite',
    'click .popover-close': 'toggleAddInvite',
    'submit .invite-contact-form': 'inviteContact'
  },

  toggleAddInvite: function(e) {
    if (e) { e.preventDefault(); }

    this.$('.contacts-add-invite-popover').toggleClass('hidden');
    if (this.$('.contacts-add-invite-popover').hasClass('hidden')) {
      this.hideSpinner();
      this.hideError();
    }
  },
  closeOnClickOff: function(e) {
    var target = $(e.target);
    if (target.parents().length > 0 &&
        target.closest('.contacts-add-invite-wrap').length === 0) {
      this.$('.contacts-add-invite-popover').addClass('hidden');
      this.hideSpinner();
      this.hideError()
    }
  },
  close: function() {
    this.$('.contacts-add-invite-popover').addClass('hidden');
    this.hideSpinner();
    this.hideError();
  },

  inviteContact: function(e) {
    e.preventDefault();
    var email = this.currentText;
    var invite = new Structural.Models.Invite({
      email: email
    });
    invite.save({}, {
      success: this.close.bind(this),
      error: this.showError.bind(this)
    });
    this.showSpinner();

    var contact = new Structural.Models.Contact({
      contact_list_id: Structural._selectedContactListId,
      user_id: undefined,
      user: {
        email: email,
        full_name: email,
        name: email
      }
    });
    this._addContactToList(contact);
  },
  addExistingUser: function(user) {
    var newContact = new Structural.Models.Contact({
      contact_list_id: Structural._selectedContactListId,
      user_id: user.id,
      user: user
    });
    newContact.save({}, {
      success: this.close.bind(this),
      error: this.showError.bind(this)
    });
    this.showSpinner();
    this._addContactToList(newContact);
  },

  _addContactToList: function(contact) {
    Structural._contactLists.get(Structural._selectedContactListId)
                            .get('contacts')
                            .add(contact);
    Structural._user.rebuildAddressBook();
  },

  showInviteOnNoOptions: function(options) {
    this.showInviteInsteadOfOptions = options.length === 0 &&
                                      this.autocomplete.text().length > 0;
    this.showHideInviteContacts();
  },
  showHideInviteContacts: function() {
    if (this.showInviteInsteadOfOptions) {
      this.$('.contacts-list').addClass('hidden');
      this.currentText = this.autocomplete.text();
      this.$('.invite-contact input').val('Invite ' + this.currentText);
      this.$('.invite-contact').removeClass('hidden');
    } else {
      this.$('.contacts-list').removeClass('hidden');
      this.$('.invite-contact').addClass('hidden');
    }
  },
  showSpinner: function() {
    this.$('.spinner').removeClass('hidden');
  },
  hideSpinner: function() {
    this.$('.spinner').addClass('hidden');
  },
  showError: function() {
    this.hideSpinner();
    this.$('.error').removeClass('hidden');
  },
  hideError: function() {
    this.$('.error').addClass('hidden');
  }
})
