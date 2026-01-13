import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/consultant_provider.dart';
import 'consultant_detail_screen.dart';

class ConsultantListScreen extends StatefulWidget {
  const ConsultantListScreen({super.key});

  @override
  State<ConsultantListScreen> createState() => _ConsultantListScreenState();
}

class _ConsultantListScreenState extends State<ConsultantListScreen> {
  @override
  void initState() {
    super.initState();
    context.read<ConsultantProvider>().fetchConsultants();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ConsultantProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text("Appointment Scheduler", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            Text("Consultants", style: TextStyle(fontSize: 18)),
          ],
        ),
        centerTitle: true,
      ),
      body: provider.loading
          ? const Center(child: CircularProgressIndicator())
          : provider.consultants.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.people_outline, size: 64, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      Text(
                        "No consultants available",
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: provider.consultants.length,
                  itemBuilder: (_, i) {
                    final c = provider.consultants[i];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      elevation: 2,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 12,
                        ),
                        leading: CircleAvatar(
                          radius: 28,
                          backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                          child: Icon(
                            Icons.person,
                            color: Theme.of(context).primaryColor,
                            size: 28,
                          ),
                        ),
                        title: Text(
                          c.name,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        subtitle: Padding(
                          padding: const EdgeInsets.only(top: 4),
                          child: Text(
                            c.specialization,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[600],
                            ),
                          ),
                        ),
                        trailing: Icon(
                          Icons.arrow_forward_ios,
                          size: 18,
                          color: Colors.grey[400],
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ConsultantDetailScreen(consultant: c),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
    );
  }
}
