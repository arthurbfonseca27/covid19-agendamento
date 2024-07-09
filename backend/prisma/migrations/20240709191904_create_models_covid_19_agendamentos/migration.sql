-- CreateTable
CREATE TABLE "agendamentos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "dataAgendamento" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "horarioAgendamento" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "agendamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agendamentos_dataAgendamento_horarioAgendamento_idx" ON "agendamentos"("dataAgendamento", "horarioAgendamento");
