---
source_url: "https://www.perplexity.ai/search/4cb60550-8abf-4589-b691-dc81c8b78a47"
thread_uuid: "5d7bcc47-40c0-4a8d-a20b-f2cd797aefe6"
slug: "4cb60550-8abf-4589-b691-dc81c8b78a47"
title: "in Qt5 and/or Qt6, I have a DAG graph and I created a subclass of QAbstractItemModel for it. Can I use this directly with a QTreeView...? I'm only familiar with QStandardItemModel.

My only requirement is nodes in the QTreeView must be able to exist in multiple branches/children/parents in the tree basically a node must be able to exist in multiple spots."
extracted_at: "2026-06-29T16:18:36.928Z"
matched_keywords: []
export_suite: "identity"
entry_count: 4
provenance: perplexity-rest-api
---

# in Qt5 and/or Qt6, I have a DAG graph and I created a subclass of QAbstractItemModel for it. Can I use this directly with a QTreeView...? I'm only familiar with QStandardItemModel.

My only requirement is nodes in the QTreeView must be able to exist in multiple branches/children/parents in the tree basically a node must be able to exist in multiple spots.

Source: [Perplexity thread](https://www.perplexity.ai/search/4cb60550-8abf-4589-b691-dc81c8b78a47)

## User

in Qt5 and/or Qt6, I have a DAG graph and I created a subclass of QAbstractItemModel for it. Can I use this directly with a QTreeView...? I'm only familiar with QStandardItemModel.

My only requirement is nodes in the QTreeView must be able to exist in multiple branches/children/parents in the tree basically a node must be able to exist in multiple spots.

## Assistant

While QTreeView is designed to work with hierarchical tree structures, it is possible to use it with a DAG (Directed Acyclic Graph) model by subclassing QAbstractItemModel. However, there are some challenges and limitations to be aware of:

1. Multiple parents: QTreeView expects each item to have a single parent. To represent a DAG where nodes can have multiple parents, you'll need to choose one parent as the "primary" parent for display purposes.

2. Implementing parent() method: The parent() method in your model will need to return a single parent index, even if the node has multiple parents in your DAG.

3. Duplicate nodes: You may need to create duplicate visual representations of nodes that appear in multiple places in the tree.

4. Consistency: Ensure that operations like editing or selecting a node in one location are reflected in all its other appearances in the tree.

Here's a basic approach to implement this:

1. In your QAbstractItemModel subclass:

```cpp
class DAGModel : public QAbstractItemModel
{
public:
    QModelIndex index(int row, int column, const QModelIndex &parent = QModelIndex()) const override
    {
        // Create a unique index for each visual representation of a node
        DAGNode* parentNode = indexToNode(parent);
        DAGNode* childNode = parentNode->children.at(row);
        return createIndex(row, column, childNode);
    }

    QModelIndex parent(const QModelIndex &index) const override
    {
        // Return the primary parent for display purposes
        DAGNode* node = indexToNode(index);
        DAGNode* parentNode = node->primaryParent;
        if (!parentNode || parentNode == rootNode)
            return QModelIndex();
        return createIndex(parentNode->row(), 0, parentNode);
    }

    // Other required overrides...

private:
    DAGNode* rootNode;
    DAGNode* indexToNode(const QModelIndex& index) const
    {
        return index.isValid() ? static_cast<DAGNode*>(index.internalPointer()) : rootNode;
    }
};
```

2. In your DAGNode class:

```cpp
struct DAGNode
{
    QList<DAGNode*> parents;
    QList<DAGNode*> children;
    DAGNode* primaryParent; // For tree representation
    // Other node data...

    int row() const
    {
        if (primaryParent)
            return primaryParent->children.indexOf(const_cast<DAGNode*>(this));
        return 0;
    }
};
```

3. When building your model:
   - Decide on a primary parent for each node.
   - Create duplicate visual representations for nodes with multiple parents.

4. Handle updates:
   - When a node is modified, emit dataChanged() signals for all its visual representations.

This approach allows you to use a DAG with QTreeView, but it's not a perfect representation of the DAG structure. The tree view will show a hierarchical version of your DAG, potentially with some nodes appearing multiple times.

For a more accurate representation of a DAG, you might consider using a custom view or a graphics framework like QGraphicsView instead.

### Sources

- [QAbstractItemModel Class | Qt Core 6.8.0 - Qt Documentation](https://doc.qt.io/qt-6/qabstractitemmodel.html)
- [QAbstractTableModel Class | Qt Core 6.8.0](https://doc.qt.io/qt-6/qabstracttablemodel.html)
- [Multi-level QTreeView - python - Stack Overflow](https://stackoverflow.com/questions/27898718/multi-level-qtreeview)
- [QAbstractItemModel to wrap multiple QStandardItemModels throws ...](https://www.qtcentre.org/threads/24900-QAbstractItemModel-to-wrap-multiple-QStandardItemModels-throws-ASSERT-in-QTreeView)
- [parent() method of QAbstractItemModel is killing me : r/QtFramework](https://www.reddit.com/r/QtFramework/comments/s33ov5/parent_method_of_qabstractitemmodel_is_killing_me/)
- [DAG (Directed acyclic graph) - QAbstractItemModel - Stack Overflow](https://stackoverflow.com/questions/9712559/dag-directed-acyclic-graph-qabstractitemmodel)
- [Multiple QTreeWidget with unique item list - Qt Forum](https://forum.qt.io/topic/114027/multiple-qtreewidget-with-unique-item-list)
- [QAbstractItemView Class | Qt Widgets 6.8.0](https://doc.qt.io/qt-6/qabstractitemview.html)
- [QAbstractItemModel & QTreeView notifications... - Qt Forum](https://forum.qt.io/topic/98325/qabstractitemmodel-qtreeview-notifications)
- [Model/View Programming | Qt Widgets 6.8.0 - Qt Documentation](https://doc.qt.io/qt-6/model-view-programming.html)
- [QTreeView/QAbstractItemModel subtrees in multiple columns](https://stackoverflow.com/questions/9779386/qtreeview-qabstractitemmodel-subtrees-in-multiple-columns)
- [Model/View Programming | Qt Widgets | Qt Documentation (Pro)](https://felgo.com/doc/qt/model-view-programming/)

## User

No that doesn't work for me. How do I work around this? The expected behavior is that when I left click a node, when it also exists in another location in the tree, it'd select and modify both.

## Assistant

I understand your requirement to have nodes appear and be selectable in multiple locations within a QTreeView, representing a DAG (Directed Acyclic Graph) structure. While QTreeView is primarily designed for hierarchical tree structures, we can implement a workaround to achieve the desired behavior. Here's an approach you can consider:

1. Modify your model to represent the DAG structure:

```cpp
class DAGModel : public QAbstractItemModel
{
public:
    // ... other methods ...

    QModelIndex index(int row, int column, const QModelIndex &parent = QModelIndex()) const override
    {
        if (!hasIndex(row, column, parent))
            return QModelIndex();

        DAGNode* parentNode = nodeFromIndex(parent);
        DAGNode* childNode = parentNode->children.at(row);
        return createIndex(row, column, childNode);
    }

    QModelIndex parent(const QModelIndex &index) const override
    {
        if (!index.isValid())
            return QModelIndex();

        DAGNode* childNode = nodeFromIndex(index);
        DAGNode* parentNode = childNode->parents.first(); // Use the first parent for tree representation
        
        if (parentNode == rootNode)
            return QModelIndex();

        return createIndex(parentNode->row(), 0, parentNode);
    }

    // ... other methods ...

private:
    DAGNode* rootNode;
    
    DAGNode* nodeFromIndex(const QModelIndex& index) const
    {
        return index.isValid() ? static_cast<DAGNode*>(index.internalPointer()) : rootNode;
    }
};
```

2. Implement a custom selection model:

```cpp
class DAGSelectionModel : public QItemSelectionModel
{
    Q_OBJECT

public:
    DAGSelectionModel(QAbstractItemModel* model, QObject* parent = nullptr)
        : QItemSelectionModel(model, parent) {}

public slots:
    void select(const QModelIndex &index, QItemSelectionModel::SelectionFlags command) override
    {
        QItemSelectionModel::select(index, command);
        
        // Find all occurrences of the selected node and select them
        DAGNode* node = static_cast<DAGNode*>(index.internalPointer());
        QModelIndexList allOccurrences = findAllOccurrences(node);
        
        for (const QModelIndex& occurrence : allOccurrences)
        {
            if (occurrence != index)
            {
                QItemSelectionModel::select(occurrence, command);
            }
        }
    }

private:
    QModelIndexList findAllOccurrences(DAGNode* node)
    {
        QModelIndexList result;
        findAllOccurrencesRecursive(QModelIndex(), node, result);
        return result;
    }

    void findAllOccurrencesRecursive(const QModelIndex& parent, DAGNode* targetNode, QModelIndexList& result)
    {
        int rowCount = model()->rowCount(parent);
        for (int row = 0; row < rowCount; ++row)
        {
            QModelIndex index = model()->index(row, 0, parent);
            DAGNode* currentNode = static_cast<DAGNode*>(index.internalPointer());
            
            if (currentNode == targetNode)
            {
                result.append(index);
            }
            
            if (model()->hasChildren(index))
            {
                findAllOccurrencesRecursive(index, targetNode, result);
            }
        }
    }
};
```

3. Use the custom selection model with your QTreeView:

```cpp
DAGModel* model = new DAGModel(this);
QTreeView* treeView = new QTreeView(this);
treeView->setModel(model);

DAGSelectionModel* selectionModel = new DAGSelectionModel(model, this);
treeView->setSelectionModel(selectionModel);
```

This approach allows nodes to appear in multiple locations within the tree and ensures that selecting a node in one location will also select its occurrences in other locations. The custom selection model overrides the `select` method to find and select all occurrences of the selected node.[1][4][5]

Keep in mind that this solution may have performance implications for large DAGs, as it searches the entire tree for each selection. You might want to optimize the search algorithm or implement caching mechanisms for better performance in such cases.

Also, remember to handle data modifications properly. When a node is modified, you'll need to update all its visual representations in the tree view.[1]

This solution provides a way to work around the limitations of QTreeView when representing a DAG structure, allowing nodes to exist and be selected in multiple locations within the tree.

### Sources

- [QTreeView Interaction (selection and setting selection) - Qt Forum](https://forum.qt.io/topic/59156/qtreeview-interaction-selection-and-setting-selection)
- [Sync selectionModel between two views where one view has a ...](https://forum.qt.io/topic/127003/sync-selectionmodel-between-two-views-where-one-view-has-a-transposed-model-of-the-other)
- [Multiple selection for the child nodes of one only parentin QTreeview?](https://stackoverflow.com/questions/22200351/multiple-selection-for-the-child-nodes-of-one-only-parentin-qtreeview)
- [Set selected items (rows) in QTreeView out of the model](https://stackoverflow.com/questions/61354602/set-selected-items-rows-in-qtreeview-out-of-the-model)
- [QItemSelectionModel synchronization problem - SOLVED [Archive]](https://www.qtcentre.org/archive/index.php)

## User

How do most people represent DAGs or work with DAGs in Qt?

## Assistant

Based on the search results and common practices in Qt development, there are a few approaches to represent and work with Directed Acyclic Graphs (DAGs) in Qt:

1. Custom QAbstractItemModel:
Many developers choose to create a custom subclass of QAbstractItemModel to represent their DAG structure. This approach allows for flexibility in how the DAG is stored and accessed internally, while providing a standard interface for Qt views.[1]

2. QGraphicsScene and QGraphicsView:
For visual representation of DAGs, developers often use QGraphicsScene and QGraphicsView. This approach is particularly useful when you need to display the graph structure visually and allow user interaction.[1]

3. Hybrid Approach:
Some developers combine a custom model with a graphics-based view. The model handles the data structure and logic, while the view takes care of visualization.

4. Third-party Libraries:
There are third-party libraries available that specialize in graph visualization and manipulation, which can be integrated with Qt applications.

When working with DAGs in Qt, developers often face challenges such as:

- Representing multiple parents: The standard tree model in Qt assumes a single parent per node, which doesn't fit the DAG structure. Developers need to find ways to handle multiple parents.[1]

- Efficient updates: Ensuring that changes to a node are reflected in all its occurrences in the view.

- Performance optimization: For large DAGs, efficient algorithms for traversal and update are crucial.

- Serialization: Implementing save and load functionality for complex DAG structures.

To address these challenges, developers typically:

- Implement custom data structures to hold the DAG information.
- Override key methods in QAbstractItemModel like index(), parent(), and data() to properly represent the DAG structure.
- Use signals and slots to keep different parts of the application in sync when the DAG changes.
- Implement custom painting if using QGraphicsScene for more control over the visual representation.

It's worth noting that while Qt provides powerful tools for working with tree structures, representing and manipulating DAGs often requires additional custom implementation to fully capture the complexity of the graph structure.

### Sources

- [DAG (Directed acyclic graph) - QAbstractItemModel - Stack Overflow](https://stackoverflow.com/questions/9712559/dag-directed-acyclic-graph-qabstractitemmodel)
- [The directed acyclic graph helped identify confounders in... - Medicine](https://journals.lww.com/md-journal/fulltext/2023/09220/the_directed_acyclic_graph_helped_identify.42.aspx)

## User

I am not understanding what you're suggesting? Do i physically need to subclass QTreeView to do what I want or do I need to subclass QAbstractItemView...?

To clarify I want to represent a singular item in a QTreeView multiple times for the DAG (different parent/children for the node)

## Assistant

I apologize for the confusion in my previous response. Let me clarify the approach for representing a DAG (Directed Acyclic Graph) in a QTreeView where nodes can appear multiple times under different parents:

1. You don't need to subclass QTreeView itself. Instead, you'll need to create a custom model by subclassing QAbstractItemModel.

2. The key to representing a DAG in a tree-like structure is to allow nodes to appear multiple times. This means your model needs to handle the concept of a node having multiple parents.

Here's a basic approach to implement this:

1. Create a custom model:

```cpp
class DAGModel : public QAbstractItemModel
{
    Q_OBJECT

public:
    DAGModel(QObject *parent = nullptr);

    QModelIndex index(int row, int column, const QModelIndex &parent = QModelIndex()) const override;
    QModelIndex parent(const QModelIndex &index) const override;
    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    int columnCount(const QModelIndex &parent = QModelIndex()) const override;
    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;

private:
    struct Node {
        QString name;
        QList<Node*> children;
        QList<Node*> parents;
    };

    Node* rootNode;
    QList<Node*> allNodes; // To keep track of all nodes for easy access
};
```

2. Implement the model methods:

```cpp
QModelIndex DAGModel::index(int row, int column, const QModelIndex &parent) const
{
    if (!hasIndex(row, column, parent))
        return QModelIndex();

    Node *parentNode = parent.isValid() ? static_cast<Node*>(parent.internalPointer()) : rootNode;
    Node *childNode = parentNode->children.at(row);
    return createIndex(row, column, childNode);
}

QModelIndex DAGModel::parent(const QModelIndex &index) const
{
    if (!index.isValid())
        return QModelIndex();

    Node *childNode = static_cast<Node*>(index.internalPointer());
    Node *parentNode = childNode->parents.first(); // Use the first parent for tree representation

    if (parentNode == rootNode)
        return QModelIndex();

    // Find the row of the parent in its parent's children list
    Node *grandParentNode = parentNode->parents.first();
    int row = grandParentNode->children.indexOf(parentNode);

    return createIndex(row, 0, parentNode);
}

int DAGModel::rowCount(const QModelIndex &parent) const
{
    if (parent.column() > 0)
        return 0;

    Node *parentNode = parent.isValid() ? static_cast<Node*>(parent.internalPointer()) : rootNode;
    return parentNode->children.size();
}

int DAGModel::columnCount(const QModelIndex &parent) const
{
    return 1; // Assuming a single column for simplicity
}

QVariant DAGModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid())
        return QVariant();

    if (role != Qt::DisplayRole)
        return QVariant();

    Node *node = static_cast<Node*>(index.internalPointer());
    return node->name;
}
```

3. Use the custom model with QTreeView:

```cpp
DAGModel *model = new DAGModel(this);
QTreeView *treeView = new QTreeView(this);
treeView->setModel(model);
```

This approach allows nodes to appear multiple times in the tree view, effectively representing a DAG structure. The key points are:

- Nodes can have multiple parents.
- The `parent()` method chooses one parent to represent the tree structure.
- The `index()` method creates unique model indexes for each appearance of a node.

Remember to properly manage memory and implement other necessary methods like `insertNode()`, `removeNode()`, etc., to manipulate your DAG structure.

This solution provides a way to represent a DAG in a QTreeView, allowing nodes to appear under multiple parents. It's not a perfect representation of a DAG, as it forces a tree-like view, but it allows for the multiple-parent relationship you're looking for.

### Sources

- [QAbstractTableModel Class](https://doc.qt.io/qt-6/qabstracttablemodel.html)
- [DAG (Directed acyclic graph) - QAbstractItemModel - Stack Overflow](https://stackoverflow.com/questions/9712559/dag-directed-acyclic-graph-qabstractitemmodel)
- [Multi-level QTreeView](https://stackoverflow.com/questions/27898718/multi-level-qtreeview)
