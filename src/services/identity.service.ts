export const identifyOrLinkContact = async (email?: string, phoneNumber?: string) => {
  // placeholder logic for now
  return {
    contact: {
      primaryContactId: 1,
      emails: [email],
      phoneNumbers: [phoneNumber],
      secondaryContactIds: []
    }
  };
};
