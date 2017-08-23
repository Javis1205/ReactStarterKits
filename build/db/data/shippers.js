import faker from 'faker'

const fakeShippers = {
  orderId: Math.floor((Math.random() * 10) + 1),
  phone: faker.phone.phoneNumber(),
  address: faker.address.streetAddress(),
  ownerId: 1,
  statusId: Math.floor((Math.random() * 10) + 1)
}

export default fakeShippers