import React from 'react';
// import shortid from "shortid";

const TableView = ({ data }: any) => {
    const { labels, datasets } = data;

    const headers = datasets.map((set: any) => (
        <th key={Math.random()}>{set.title}</th>
    ));

    const rows = labels.map((label: any, i: number) => {
        return (
            <tr key={Math.random()}>
                <td key={Math.random()}>{label}</td>
                {datasets.map((set: any) => <td key={Math.random()}>{set.values[i]}</td>)}
            </tr>
        );
    });

    return (
        <table>
            <thead>
                <tr>
                    <th key={Math.random()}>Labels</th>
                    {headers}
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </table>
    );
};

export default TableView;
