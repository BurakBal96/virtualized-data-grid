import React, { useCallback, useEffect, useState, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { CSS_BACKGROUND_VARIABLE, Grid, GridRow } from '../../Components/DataGrid';
import { COLUMNS } from './Columns';
import { ContainerLoader } from '../../Components/Loader/Loader';
import styles from './home.module.scss';

import { faker } from '@faker-js/faker';

const ITEM_COUNT = 100_000;

function createRandomUser() {
    return {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past()
    };
}

export const Home = (props) => {
    const pageRef = useRef(null);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    const addItems = useCallback(
        async () =>
            setList(
                list.concat(
                    faker.helpers.multiple(createRandomUser, {
                        count: 100_000
                    })
                )
            ),
        [list]
    );

    useEffect(() => {
        if (list.length < ITEM_COUNT) {
            addItems();
        } else {
            setLoading(false);
        }
    }, [list, addItems]);

    const onCustomCellClick = (index, data) => alert(`Column ${index + 1} clicked, data: \n${JSON.stringify(data, null, 2)}`);

    return (
        <div className={styles.homePage}>
            {loading && (
                <ContainerLoader containerRef={pageRef} text={`Generating ${ITEM_COUNT} items for list, this might take some time`} />
            )}
            <div className={styles.container} ref={pageRef}>
                {!loading && (
                    <Grid
                        columns={COLUMNS}
                        rowHeight={30}
                        rowData={{
                            list,
                            onCustomCellClick
                        }}
                        row={Row}
                        overscanCount={5}
                        width='100%'
                    />
                )}
            </div>
        </div>
    );
};

export const Row = inject('TableStore')(
    observer((props) => {
        const { list } = props.TableStore;
        if (!list.length) return null;
        const { index } = props;

        const background = index % 2 ? '#fafafa' : '#cacaca';

        return <GridRow {...props} style={{ [CSS_BACKGROUND_VARIABLE]: background }} />;
    })
);
