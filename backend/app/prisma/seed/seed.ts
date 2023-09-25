import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function seedTenant1(){
    const pumpe = await prisma.maintenanceObject.upsert({
        where: { id: 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fd'},
        update: {},
        create: {
            id: 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fd',
            name: "Pumpe",
            tenantId: "tenant1",
        },
      });
    
      const ventil = await prisma.maintenanceObject.upsert({
        where: { id: '83c96542-cb9e-4919-aace-97008f7d0519'},
        update: {},
        create: {
            id: '83c96542-cb9e-4919-aace-97008f7d0519',
            name: "Ventil",
            tenantId: "tenant1",
        },
      });
    
      const raumController = await prisma.maintenanceObject.upsert({
        where: { id: '35e7962f-602a-4c68-a074-cbd2ad709997'},
        update: {},
        create: {
            id: '35e7962f-602a-4c68-a074-cbd2ad709997',
            name: "Raum-Controller",
            tenantId: "tenant1",
        },
      });
    
      const report1 = await prisma.maintenanceReport.upsert({
        where: {id: '9c896e11-930f-48f6-80db-0db1a893557c'},
        update: {},
        create: {
            id: '9c896e11-930f-48f6-80db-0db1a893557c',
            year: 2022,
            tenantId: 'tenant1',
            entries: {
                createMany: {
                    data: [
                        {
                            date: '21-07-2022',
                            maintainer: 'Manuel',
                            tenantId: 'tenant1',
                            id: 'a2d2b3f1-0c1c-410e-bbb7-cbca8010fb27',
                            maintenanceObjectId: '35e7962f-602a-4c68-a074-cbd2ad709997'
                        },
                        {
                            date: '21-07-2022',
                            maintainer: 'Christian',
                            tenantId: 'tenant1',
                            id: '5302f6c5-e904-4900-b4f9-501c8b853491',
                            maintenanceObjectId: '83c96542-cb9e-4919-aace-97008f7d0519'
                        },
    
                    ]
                }
            }
        }
      });
    
      const report2 = await prisma.maintenanceReport.upsert({
        where: {id: '4aa437b6-067f-485d-80d4-a8d97c94f7da'},
        update: {},
        create: {
            id: '4aa437b6-067f-485d-80d4-a8d97c94f7da',
            year: 2021,
            tenantId: 'tenant1',
            entries: {
                createMany: {
                    data: [
                        {
                            date: '29-04-2021',
                            maintainer: 'Ann-Marie',
                            tenantId: 'tenant1',
                            id: '32a2e8b3-0661-4662-96bc-0ec94013aa5e',
                            maintenanceObjectId: 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fd'
                        },
                        {
                            date: '01-05-2021',
                            maintainer: 'Manfred',
                            tenantId: 'tenant1',
                            id: '0204ab4e-bc73-458e-a282-0fffdb756ac7',
                            maintenanceObjectId: '35e7962f-602a-4c68-a074-cbd2ad709997'
                        },
    
                    ]
                }
            }
        }
      });
    
      console.log({ pumpe, ventil, raumController, report1, report2 })
}

async function seedTenant2(){
    const außenluftKlappe = await prisma.maintenanceObject.upsert({
        where: { id: '35e7962f-602a-4c68-a074-cbd2ad709998'},
        update: {},
        create: {
            id: '35e7962f-602a-4c68-a074-cbd2ad709998',
            name: "Außenluftklappe",
            tenantId: "tenant2",
        },
      });
    
      const tempSensor = await prisma.maintenanceObject.upsert({
        where: { id: '83c96542-cb9e-4919-aace-97008f7d0520'},
        update: {},
        create: {
            id: '83c96542-cb9e-4919-aace-97008f7d0520',
            name: "Temp Sensor",
            tenantId: "tenant2",
        },
      });
    
      const schaltschrank = await prisma.maintenanceObject.upsert({
        where: { id: 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fe'},
        update: {},
        create: {
            id: 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fe',
            name: "Schaltschrank",
            tenantId: "tenant2",
        },
      });
    
      const report1 = await prisma.maintenanceReport.upsert({
        where: {id: '9c896e11-930f-48f6-80db-0db1a893557b'},
        update: {},
        create: {
            id: '9c896e11-930f-48f6-80db-0db1a893557b',
            year: 2022,
            tenantId: 'tenant2',
            entries: {
                createMany: {
                    data: [
                        {
                            date: '13-06-2022',
                            maintainer: 'Bob',
                            tenantId: 'tenant2',
                            id: 'a2d2b3f1-0c1c-410e-bbb7-cbca8010fb28',
                            maintenanceObjectId: '35e7962f-602a-4c68-a074-cbd2ad709998'
                        },
                        {
                            date: '14-06-2022',
                            maintainer: 'Thomas',
                            tenantId: 'tenant2',
                            id: '5302f6c5-e904-4900-b4f9-501c8b853492',
                            maintenanceObjectId: '83c96542-cb9e-4919-aace-97008f7d0520'
                        },
    
                    ]
                }
            }
        }
      });
    
      const report2 = await prisma.maintenanceReport.upsert({
        where: {id: '4aa437b6-067f-485d-80d4-a8d97c94f7dc'},
        update: {},
        create: {
            id: '4aa437b6-067f-485d-80d4-a8d97c94f7dc',
            year: 2021,
            tenantId: 'tenant1',
            entries: {
                createMany: {
                    data: [
                        {
                            date: '05-05-2021',
                            maintainer: 'Pascal',
                            tenantId: 'tenant2',
                            id: '32a2e8b3-0661-4662-96bc-0ec94013aa5f',
                            maintenanceObjectId: '83c96542-cb9e-4919-aace-97008f7d0520'
                        },
                        {
                            date: '29-05-2021',
                            maintainer: 'Daniel',
                            tenantId: 'tenant2',
                            id: '0204ab4e-bc73-458e-a282-0fffdb756ac8',
                            maintenanceObjectId: 'e82e9f53-2476-41c2-9f9e-4a6ad532e1fe'
                        },
    
                    ]
                }
            }
        }
      });
    
      console.log({ außenluftKlappe, tempSensor, schaltschrank, report1, report2 })
}

async function main() {
    await seedTenant1();
    await seedTenant2();

}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })