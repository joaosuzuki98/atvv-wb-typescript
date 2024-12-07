import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select } from "antd";
import TableComponent from "../components/Table/Table";
import Template from "./Template";
import api from "../services/api";

const { Option } = Select;

type Cliente = {
    id: number;
    nome: string;
    cpf: string;
    genero: string;
    dataEmissaoCPF: string;
    nomeSocial?: string;
}

const Clientes: React.FC = () => {
    const [data, setData] = useState<Cliente[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await api.get("/clientes");
                setData(response.data);
            } catch (error) {
                console.error("Error fetching clientes:", error);
            }
        };
        fetchClientes();
    }, []);

    const handleSave = async (record: Cliente) => {
        try {
            await api.put(`/clientes/${record.id}`, record);
            setData((prev) => prev.map((item) => (item.id === record.id ? record : item)));
        } catch (error) {
            console.error("Error updating cliente:", error);
        }
    };

    const handleDelete = async (keys: React.Key[]) => {
        try {
            await Promise.all(keys.map((key) => api.delete(`/clientes/${key}`)));
            setData((prev) => prev.filter((item) => !keys.includes(item.id)));
        } catch (error) {
            console.error("Error deleting clientes:", error);
        }
    };

    const handleAdd = async (values: Omit<Cliente, "id">) => {
        try {
            const response = await api.post("/clientes", values);
            setData((prev) => [...prev, response.data]);
            form.resetFields();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding cliente:", error);
        }
    };

    const columns = [
        { title: "Nome", dataIndex: "nome", key: "nome" },
        { title: "Nome Social", dataIndex: "nomeSocial", key: "nomeSocial" },
        { title: "CPF", dataIndex: "cpf", key: "cpf" },
        { title: "Gênero", dataIndex: "genero", key: "genero" },
        { title: "Data de Emissão do CPF", dataIndex: "dataEmissaoCPF", key: "dataEmissaoCPF" },
    ];

    const modalFields = [
        { name: "nome", label: "Nome", type: "text" },
        { name: "nomeSocial", label: "Nome Social", type: "text" },
        { name: "cpf", label: "CPF", type: "text" },
        {
            name: "genero",
            label: "Gênero",
            type: "select",
            options: ["Masculino", "Feminino", "Outro"],
        },
        { name: "dataEmissaoCPF", label: "Data de Emissão do CPF", type: "date" },
    ];

    return (
        <Template title="Clientes" subtitle="Gerencie clientes">
            <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
                Adicionar Cliente
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
                title="Adicionar Cliente"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAdd}
                    initialValues={{ genero: "Masculino" }}
                >
                    {modalFields.map((field) =>
                        field.type === "select" ? (
                            <Form.Item
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                rules={[{ required: true, message: `Por favor, insira ${field.label.toLowerCase()}` }]}
                            >
                                <Select>
                                    {field.options?.map((option) => (
                                        <Option key={option} value={option}>
                                            {option}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ) : (
                            <Form.Item
                                key={field.name}
                                name={field.name}
                                label={field.label}
                                rules={[{ required: true, message: `Por favor, insira ${field.label.toLowerCase()}` }]}
                            >
                                <Input type={field.type} />
                            </Form.Item>
                        )
                    )}
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

export default Clientes;
