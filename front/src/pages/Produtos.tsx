import React, { useState, useEffect } from "react";
import TableComponent from "../components/Table/Table";
import Template from "./Template";
import api from "../services/api";
import { Button, Modal, Form, Input } from "antd";

interface Produto {
    id: string;
    nome: string;
    preco: string | number;
}

const Produtos: React.FC = () => {
    const [data, setData] = useState<Produto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Nome", dataIndex: "nome", key: "nome" },
        { title: "Preço", dataIndex: "preco", key: "preco" },
    ];

    const modalFields = [
        { name: "nome", label: "Nome do Produto" },
        { name: "preco", label: "Preço", type: "number" },
    ];

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await api.get("/produtos");
                setData(response.data);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProdutos();
    }, []);

    const handleSave = async (record: Produto) => {
        try {
            await api.put(`/produtos/${record.id}`, record);
            setData((prev) => prev.map((item) => (item.id === record.id ? record : item)));
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
        }
    };

    const handleDelete = async (keys: React.Key[]) => {
        try {
            await Promise.all(keys.map((key) => api.delete(`/produtos/${key}`)));
            setData((prev) => prev.filter((item) => !keys.includes(item.id)));
        } catch (error) {
            console.error("Erro ao deletar produtos:", error);
        }
    };

    const handleAdd = async (values: any) => {
        try {
            const response = await api.post("/produtos", values);
            setData((prev) => [...prev, response.data]);
            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Erro ao adicionar produto:", error);
        }
    };

    return (
        <Template title="Produtos" subtitle="Gerencie produtos">
            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                Adicionar Produto
            </Button>
            <TableComponent
                columns={columns}
                data={data}
                onSave={handleSave}
                onDelete={handleDelete}
                modalFields={modalFields}
                rowKey="id"
            />

            <Modal
                title="Adicionar Produto"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAdd}
                    initialValues={{}}
                >
                    {modalFields.map((field) => (
                        <Form.Item
                            key={field.name}
                            name={field.name}
                            label={field.label}
                            rules={[{ required: true, message: `Por favor, insira ${field.label.toLowerCase()}` }]}
                        >
                            {field.type === "number" ? (
                                <Input type="number" />
                            ) : (
                                <Input />
                            )}
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Salvar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Template>
    );
};

export default Produtos;
