const { useState, useEffect, useMemo } = React;

const TodoItem = (props) => {
    const { id, content, isFinish, onFinish, onRemove } = props;
    return (
        <>
            <li>
                <label htmlFor={id} className="todoList_label">
                    <input
                        id={id}
                        className="todoList_input"
                        type="checkbox"
                        checked={isFinish ? 'checked' : ''}
                        value={isFinish ? true : false}
                        onChange={(e) => onFinish(e)}
                    />
                    <span>{content}</span>
                </label>
                <a href="#" id={id} onClick={(e) => onRemove(e)}>
                    <i className="fa fa-times"></i>
                </a>
            </li>
        </>
    );
};
const AddItem = (props) => {
    const { newItem, setNewItem, onAdd } = props;
    return (
        <>
            <div className="inputBox">
                <input
                    type="text"
                    value={newItem || ''}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="請輸入待辦事項事項"
                />

                <a href="#" onClick={onAdd}>
                    <i className="fa fa-plus"></i>
                </a>
            </div>
        </>
    );
};
const StatusFilter = (props) => {
    const { currentStatus, setCurrentStatus } = props;
    let statusList = [
        {
            name: '全部',
            status: 0,
            active: true,
        },
        {
            name: '待完成',
            status: 1,
            active: false,
        },
        {
            name: '已完成',
            status: 2,
            active: false,
        },
    ];

    const onFilter = (statusCode) => {
        // statusCode: 0 全部 ; 1 待完成 ; 2 已完成
        setCurrentStatus(statusCode);
    };

    return (
        <ul className="todoList_tab">
            {statusList.map((item) => {
                return (
                    <li data-status={item.status} key={item.status} onClick={(e) => onFilter(item.status)}>
                        <a href="#" className={item.status === currentStatus ? 'active' : ''}>
                            {item.name}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};
const Footer = (props) => {
    const { todoItems, setTodoItmes } = props;
    const onRemoveFinished = () => {
        setTodoItmes(todoItems.filter((item) => item.isFinish !== true));
    };
    return (
        <>
            <div className="todoList_statistics">
                <p> {todoItems.filter((item) => item.isFinish === true).length} 個已完成項目</p>
                <a href="#" onClick={onRemoveFinished}>
                    清除已完成項目
                </a>
            </div>
        </>
    );
};

const App = () => {
    const [newItem, setNewItem] = useState('');
    const [todoItems, setTodoItmes] = useState([
        {
            id: 1,
            content: '去買菜',
            isFinish: false,
        },
        {
            id: 2,
            content: '記帳',
            isFinish: true,
        },
    ]);
    const [currentStatus, setCurrentStatus] = useState(0);

    const filterTodoItems = useMemo(() => {
        switch (currentStatus) {
            case 0: // 全部
                return todoItems;
            case 1: // 待完成
                return todoItems.filter((item) => item.isFinish == false);
            case 2: // 已完成
                return todoItems.filter((item) => item.isFinish == true);
        }
    }, [currentStatus, todoItems]);

    const onFinish = (e) => {
        const { id, checked } = e.currentTarget;
        setTodoItmes(todoItems.map((item) => (item.id == id ? { ...item, isFinish: checked } : item)));
    };

    const onRemove = (e) => {
        const { id } = e.currentTarget;
        setTodoItmes(todoItems.filter((item) => item.id != id));
    };

    const onAdd = () => {
        if (newItem === '') return;
        const timestamp = new Date().getTime();
        setTodoItmes([
            ...todoItems,
            {
                id: timestamp,
                content: newItem,
                isFinish: false,
            },
        ]);
        // init
        setNewItem();
    };

    return (
        <>
            <div id="todoListPage" className="bg-half">
                <div className="conatiner todoListPage vhContainer">
                    <div className="todoList_Content">
                        <AddItem newItem={newItem} setNewItem={setNewItem} onAdd={onAdd}></AddItem>

                        <div className="todoList_list">
                            <StatusFilter
                                currentStatus={currentStatus}
                                todoItems={todoItems}
                                setTodoItmes={setTodoItmes}
                                setCurrentStatus={setCurrentStatus}
                            ></StatusFilter>
                            <div className="todoList_items">
                                <ul className="todoList_item">
                                    {filterTodoItems.map((item) => {
                                        const { id, content, isFinish } = item;
                                        return (
                                            <TodoItem
                                                key={id}
                                                id={id}
                                                content={content}
                                                isFinish={isFinish}
                                                onFinish={onFinish}
                                                onRemove={onRemove}
                                            ></TodoItem>
                                        );
                                    })}
                                </ul>
                                <Footer todoItems={todoItems} setTodoItmes={setTodoItmes}></Footer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
