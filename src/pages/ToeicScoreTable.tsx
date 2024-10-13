import { Card } from "primereact/card";
import React from "react";
import { DataTable, DataTableValue } from "primereact/datatable";
import { Column } from "primereact/column";

// interface ToeicSocreRow extends DataTableValue{
//     correctCount1
// } 

export default function ToeicScorePage() {
    const readingValues: DataTableValue[] = GenerateDataForToeicReadingScoreTable();
    const listeningValues: DataTableValue[] = GenerateDataForToeicListeningScoreTable();
    return (
        <main className="flex flex-wrap py-3 min-w-screen">
            <section className="text-center">
                <h1>Bảng tính điểm TOEIC Reading</h1>
                <Card className="flex align-items-center justify-content-center border-round m-2 shadow-2">
                    <DataTable value={readingValues} stripedRows showGridlines scrollable scrollHeight="400px" >
                        <Column header="số câu đúng" body={(row) => <b>{row.cell[0]}</b>} style={{ textAlign: 'center' }} />
                        <Column header="điểm" body={(row) => <React.Fragment>{row.cell[1]}</React.Fragment>} style={{ textAlign: 'center' }} />
                        <Column header="số câu đúng" body={(row) => <b>{row.cell[2]}</b>} style={{ textAlign: 'center' }} />
                        <Column header="điểm" body={(row) => <React.Fragment>{row.cell[3]}</React.Fragment>} style={{ textAlign: 'center' }} />
                        <Column header="số câu đúng" body={(row) => <b>{row.cell[4]}</b>} style={{ textAlign: 'center' }} />
                        <Column header="điểm" body={(row) => <React.Fragment>{row.cell[5]}</React.Fragment>} style={{ textAlign: 'center' }} />
                    </DataTable>
                </Card>
            </section>
            <section className="text-center">
                <h1>Bảng tính điểm TOEIC Listening</h1>
                <Card className="flex align-items-center justify-content-center border-round m-2 shadow-2">
                    <DataTable value={listeningValues} stripedRows showGridlines scrollable scrollHeight="400px">
                        <Column header="số câu đúng" body={(row) => <b>{row.cell[0]}</b>} style={{ textAlign: 'center' }} />
                        <Column header="điểm" body={(row) => <React.Fragment>{row.cell[1]}</React.Fragment>} style={{ textAlign: 'center' }} />
                        <Column header="số câu đúng" body={(row) => <b>{row.cell[2]}</b>} style={{ textAlign: 'center' }} />
                        <Column header="điểm" body={(row) => <React.Fragment>{row.cell[3]}</React.Fragment>} style={{ textAlign: 'center' }} />
                        <Column header="số câu đúng" body={(row) => <b>{row.cell[4]}</b>} style={{ textAlign: 'center' }} />
                        <Column header="điểm" body={(row) => <React.Fragment>{row.cell[5]}</React.Fragment>} style={{ textAlign: 'center' }} />
                    </DataTable>
                </Card>
            </section>
        </main>
    )
};


function GenerateDataForToeicReadingScoreTable(): DataTableValue[] {
    let row: DataTableValue[] = [
        { cell: [0, 5, 1, 5, 2, 5] }  // Initial row
    ];

    for (let i = 3; i <= 100; ++i) {
        let index = Math.floor(i / 3);  // Ensure index is an integer
        if (!row[index]) {
            row[index] = { cell: [] };  // Initialize new row if not already present
        }
        row[index].cell[2 * (i % 3)] = i;
        row[index].cell[2 * (i % 3) + 1] = (i - 1) * 5;  // Fill the cell with calculated values
    }

    return row;
}


function GenerateDataForToeicListeningScoreTable(): DataTableValue[] {
    let row: DataTableValue[] = [
        { cell: [0, 5] }  // Initial row
    ];
    let i = 1;
    for (; i <= 75; ++i) {
        let index = Math.floor(i / 3);  // Ensure index is an integer
        if (!row[index]) {
            row[index] = { cell: [] };  // Initialize new row if not already present
        }
        row[index].cell[2 * (i % 3)] = i;
        row[index].cell[2 * (i % 3) + 1] = (i + 2) * 5;  // Fill the cell with calculated values
    }
    for (; i <= 96; ++i) {
        let index = Math.floor(i / 3);  // Ensure index is an integer
        if (!row[index]) {
            row[index] = { cell: [] };  // Initialize new row if not already present
        }
        row[index].cell[2 * (i % 3)] = i;
        row[index].cell[2 * (i % 3) + 1] = (i + 3) * 5;  // Fill the cell with calculated values
    }
    for (; i <= 100; ++i) {
        let index = Math.floor(i / 3);  // Ensure index is an integer
        if (!row[index]) {
            row[index] = { cell: [] };  // Initialize new row if not already present
        }
        row[index].cell[2 * (i % 3)] = i;
        row[index].cell[2 * (i % 3) + 1] = 495;
    }
    return row;
}
