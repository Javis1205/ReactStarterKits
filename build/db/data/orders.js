import faker from 'faker'

const fakeOrders = {
  code: faker.random.word(),
  products:faker.random.word(),
  orderAt:faker.date.future(1),
  deadline:faker.date.future(1),
  shopperPhone:faker.phone.phoneNumber(),
  shipperPhone:faker.phone.phoneNumber(),
  address: faker.address.streetAddress(),
  totalPayment:Math.floor((Math.random() * 20) + 1)+'00000',
  ownerId: 1,
  statusId: Math.floor((Math.random() * 10) + 1),
  // createdAt: faker.date.recent(1),
  // updatedAt: faker.date.recent(2)
}

export default fakeOrders