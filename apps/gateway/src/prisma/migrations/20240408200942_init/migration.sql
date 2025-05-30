-- CreateTable
CREATE TABLE "Role" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Event" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "evenueId" TEXT NOT NULL,
    "display" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Ticket_category" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Ticket_category_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Ticket_categoryOnEvent" (
    "eventId" TEXT NOT NULL,
    "ticket_categoryId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "ticket_sold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Ticket_categoryOnEvent_pkey" PRIMARY KEY ("eventId","ticket_categoryId")
);

-- CreateTable
CREATE TABLE "Team" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "university" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Match" (
    "time" TEXT NOT NULL,
    "team1Id" TEXT NOT NULL,
    "team2Id" TEXT NOT NULL,
    "goal1" INTEGER NOT NULL,
    "goal2" INTEGER NOT NULL,
    "teamIdWinner" TEXT,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("team1Id","team2Id","eventId")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "debitNumber" TEXT NOT NULL,
    "way" TEXT NOT NULL,
    "didAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ticket_categoryId" TEXT NOT NULL,
    "scanned" BOOLEAN DEFAULT false,
    "scannedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "scannedByUserId" TEXT,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("eventId","transactionId","code")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_tel_key" ON "User"("tel");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_key" ON "Venue"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_category_name_key" ON "Ticket_category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_code_key" ON "Transaction"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_code_key" ON "Ticket"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_evenueId_fkey" FOREIGN KEY ("evenueId") REFERENCES "Venue"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket_categoryOnEvent" ADD CONSTRAINT "Ticket_categoryOnEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket_categoryOnEvent" ADD CONSTRAINT "Ticket_categoryOnEvent_ticket_categoryId_fkey" FOREIGN KEY ("ticket_categoryId") REFERENCES "Ticket_category"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_teamIdWinner_fkey" FOREIGN KEY ("teamIdWinner") REFERENCES "Team"("_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_ticket_categoryId_fkey" FOREIGN KEY ("ticket_categoryId") REFERENCES "Ticket_category"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_scannedByUserId_fkey" FOREIGN KEY ("scannedByUserId") REFERENCES "User"("_id") ON DELETE SET NULL ON UPDATE CASCADE;
