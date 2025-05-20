import React from "react";

export interface IDGroup {
    title: string,
    idValue: string
}
export default function IDGroupCell(idGroups: IDGroup[]): JSX.Element {
    return (
        <div
            //------------------------------------------------------
            // 1. CSS Grid container with spacing
            //------------------------------------------------------
            style={{
                display: 'grid',
                gridTemplateColumns: 'max-content auto', // title / value cols
                gap: '0.25rem 1rem',                     // row-gap .25rem, col-gap 1rem
                alignItems: 'center',
                padding: '0.5rem 0',                    // vertical padding
            }}
        >
            {idGroups.map((idg, idx) => (
                <React.Fragment key={idx}>
                    <div
                        style={{
                            whiteSpace: 'nowrap',
                            fontWeight: 600,
                        }}
                    >
                        {idg.title}
                    </div>
                    <div
                        style={{
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {idg.idValue}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}